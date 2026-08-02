const subtitleCache: { [url: string]: Promise<string> | undefined } = {};

interface SubtitleCue {
	content: string;
	fileIndex: number;
	cueIndex: number;
	startTime: number;
}

export interface ParsedSubtitleCue {
	startTime: number;
	endTime: number;
	text: string;
}

export interface ParsedSubtitleTrack {
	id: string;
	cues: ParsedSubtitleCue[];
}

export class SubtitleHelper {
	static mergeSubtitles(subtitles: string[]): string {
		const cues: SubtitleCue[] = [];

		subtitles.forEach((subtitleContent, fileIndex) => {
			const blocks = subtitleContent
				.replace(/^\uFEFF/, '')
				.replace(/\r\n?/g, '\n')
				.split(/\n{2,}/);

			blocks.forEach(block => {
				const lines = block.trim().split('\n');
				const timingLineIndex = lines.findIndex(line => line.includes('-->'));
				if (timingLineIndex === -1) return;

				const timingMatch = /^(\S+)\s+-->\s+(\S+)/.exec(lines[timingLineIndex].trim());
				if (!timingMatch) return;

				// Leave line placement automatic so native players can avoid wrapped-cue collisions.
				lines[timingLineIndex] = `${timingMatch[1]} --> ${timingMatch[2]} position:50% size:95% align:center`;
				cues.push({
					content: lines.join('\n'),
					fileIndex,
					cueIndex: cues.length,
					startTime: this.parseTimestamp(timingMatch[1]),
				});
			});
		});

		cues.sort(
			(a, b) => a.startTime - b.startTime || a.fileIndex - b.fileIndex || a.cueIndex - b.cueIndex
		);

		return `WEBVTT\n\n${cues.map(cue => cue.content).join('\n\n')}\n`;
	}

	static fetchSubtitle(url: string): Promise<string> {
		if (subtitleCache[url]) {
			return subtitleCache[url]!;
		}
		return (subtitleCache[url] = fetch(url).then(res => res.text()));
	}

	static parseSubtitle(content: string): ParsedSubtitleCue[] {
		return content
			.replace(/^\uFEFF/, '')
			.replace(/\r\n?/g, '\n')
			.split(/\n{2,}/)
			.flatMap(block => {
				const lines = block.trim().split('\n');
				const timingLineIndex = lines.findIndex(line => line.includes('-->'));
				if (timingLineIndex === -1) return [];

				const timingMatch = /^(\S+)\s+-->\s+(\S+)/.exec(lines[timingLineIndex].trim());
				if (!timingMatch) return [];

				const startTime = this.parseTimestamp(timingMatch[1]);
				const endTime = this.parseTimestamp(timingMatch[2]);
				if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) return [];

				const text = lines
					.slice(timingLineIndex + 1)
					.join('\n')
					.replace(/<br\s*\/?\s*>/gi, '\n')
					.replace(/<[^>]+>/g, '')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&amp;/g, '&')
					.replace(/&nbsp;/g, '\u00a0')
					.trim();

				return text ? [{ startTime, endTime, text }] : [];
			});
	}

	private static parseTimestamp(timestamp: string): number {
		const parts = timestamp.split(':');
		if (parts.length < 2 || parts.length > 3) return Number.POSITIVE_INFINITY;

		const seconds = Number(parts.pop());
		const minutes = Number(parts.pop());
		const hours = parts.length ? Number(parts.pop()) : 0;
		if (![hours, minutes, seconds].every(Number.isFinite)) return Number.POSITIVE_INFINITY;

		return hours * 3600 + minutes * 60 + seconds;
	}
}
