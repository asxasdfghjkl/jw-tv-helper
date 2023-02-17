import { LangObj } from '../objs/LangObj';
import { MediaInfoObj } from '../objs/MediaInfoObj';
import { MediaParser } from './MediaParser';

export class TvPageParser implements MediaParser {
	videoId: string;

	constructor(hashRoute: string) {
		const lastSlash: number = hashRoute.lastIndexOf('/');
		this.videoId = hashRoute.substring(lastSlash + 1);
	}

	async getFilesInfo(lang: LangObj): Promise<MediaInfoObj> {
		const url: string = `https://b.jw-cdn.org/apis/mediator/v1/media-items/${lang.code}/${this.videoId}`;
		const response = await fetch(url);
		const json = (await response.json()).media[0];

		return {
			title: json.title,
			files: json.files.map((file: any) => ({
				label: file.subtitled ? `${file.label} (Subtitled)` : file.label,
				videoLink: file.progressiveDownloadURL,
				subtitleLink: file.subtitles?.url,
			})),
		};
	}
}
