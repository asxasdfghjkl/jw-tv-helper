import { LangObj } from '../objs/LangObj';
import { MediaInfoObj } from '../objs/MediaInfoObj';

export declare interface MediaParser {
  getFilesInfo(lang: LangObj): Promise<MediaInfoObj>;
}
