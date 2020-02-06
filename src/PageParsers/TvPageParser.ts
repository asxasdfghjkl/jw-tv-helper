import { ILangObj } from '@/objs/ILangObj';
import { ParsedInfoObj } from '@/objs/ParsedInfoObj';
import { PageParser } from './PageParser';

export class TvPageParser implements PageParser {
  videoId: string;

  constructor(hashRoute: string) {
    const lastSlash: number = hashRoute.lastIndexOf("/");
    this.videoId = hashRoute.substring(lastSlash + 1);
  }

  async getFilesInfo(lang: ILangObj): Promise<ParsedInfoObj> {
    const url: string = `https://data.jw-api.org/mediator/v1/media-items/${lang.code}/${this.videoId}?clientType=tvjworg`;
    const response = await fetch(url);
    const json = (await response.json()).media[0];

    return  {
      title: json.title,
      files: json.files.map((file: any) => ({
        label: file.subtitled ? `${file.label} (Subtitled)` : file.label,
        videoLink: file.progressiveDownloadURL,
        subtitleLink: file.subtitles?.url,
      }))
    };
  }
}