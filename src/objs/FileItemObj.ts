import { LangObj } from './LangObj';

export type FileItemObj = {
	url: string;
	lang: LangObj;
	type: FileItemType;
};

export type FileItemType = 'video' | 'subtitle';
