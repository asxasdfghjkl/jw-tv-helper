import { ILangObj } from '@/objs/ILangObj';
import { ParsedInfoObj } from '@/objs/ParsedInfoObj';

export declare interface PageParser {
  getFilesInfo(lang: ILangObj): Promise<ParsedInfoObj>;
}
