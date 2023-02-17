import { LangObj } from '../objs/LangObj';
import { MediaInfoObj } from '../objs/MediaInfoObj';
import { MediaParser } from './MediaParser';

export class PubicationMediaParser implements MediaParser {
	private queries: string;
	constructor(jsonUrl: string) {
		const queryStartIndex = jsonUrl.indexOf('?');
		this.queries = jsonUrl.substring(queryStartIndex);
	}

	async getFilesInfo(lang: LangObj): Promise<MediaInfoObj> {
		const params = new URLSearchParams(this.queries);
		params.delete('alllangs');
		params.set('langwritten', lang.code);
		params.set('txtCMSLang', lang.code);
		params.set('fileformat', 'mp4');

		const response = await fetch(`https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?${params.toString()}`);
		const json = await response.json();
		const files = json.files[lang.code.toUpperCase()].MP4;
		return {
			title: files[0]?.title,
			files: files.map((file: any) => ({
				label: file.subtitled ? `${file.label} (Subtitled)` : file.label,
				videoLink: file.file.url,
				subtitleLink: file.subtitles?.url,
			})),
		};
	}
}
