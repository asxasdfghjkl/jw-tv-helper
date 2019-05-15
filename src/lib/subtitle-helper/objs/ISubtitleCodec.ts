import { ISubtitleCueObj } from "./ISubtitleCueObj";

export declare interface ISubtitleCodec {
  read(vttContent: string): ISubtitleCueObj[];
  write(cues: ISubtitleCueObj[]): string;
}
