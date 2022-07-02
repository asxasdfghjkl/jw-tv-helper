const subtitleCache: { [url: string]: Promise<string> | undefined } = {};

export class SubtitleHelper {
	static mergeSubtitles(subtitles: string[]): string {
		if (subtitles.length === 1) return subtitles[0];
		const lines = subtitles
			.map(subtitleContent => {
				const cues = subtitleContent.replace(/\r/g, '').split('\n\n');
				cues.shift(); // remove file header 'WEBVTT'
				return cues.filter(c => !!c);
			})
			.reduce((prev, current) => prev.concat(current), []);

		lines.sort((a, b) => a.localeCompare(b));
		lines.unshift('WEBVTT');
		return lines.join('\n\n');
	}

	static fetchSubtitle(url: string): Promise<string> {
		if (subtitleCache[url]) {
			return subtitleCache[url]!;
		}
		return (subtitleCache[url] = fetch(url).then(res => res.text()));
	}

	static removePosition(subtitle: string): string {
		return subtitle.replace(/line:\d+% /g, '');
	}
}
