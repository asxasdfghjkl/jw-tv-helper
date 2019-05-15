import { ILangObj } from "@/objs/ILangObj";

export declare interface IFileItemObj {
  url: string;
  lang: ILangObj;
  type?: "video" | "subtitles";
  content?: string;
}