import { LangObj } from '../Objs/LangObj';
import { MediaInfoObj } from '../Objs/MediaInfoObj';

export declare interface MediaParser {
  getFilesInfo(lang: LangObj): Promise<MediaInfoObj>;
}
