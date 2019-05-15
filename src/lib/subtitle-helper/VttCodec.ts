import { ISubtitleCodec } from "./objs/ISubtitleCodec";
import { ISubtitleCueObj } from "./objs/ISubtitleCueObj";

const time = {
  groups: {
    id: 1,
    start: 2,
    end: 3,
    attr: 4,
    content: 5
  },
  // tslint:disable-next-line:max-line-length
  regex: /(?:(\w+)?\s+)?(\d{2}\:\d{2}\:\d{2}\.\d{3}|\d{2}\:\d{2}\.\d{3})\s+-->\s+(\d{2}\:\d{2}\:\d{2}\.\d{3}|\d{2}\:\d{2}\.\d{3})(?:\s(.+))?/m,
};

export class VttCodec implements ISubtitleCodec {
  read(vttContent: string): ISubtitleCueObj[] {
    const cueStrs: string[] = vttContent.replace(/\r/g, "").split("\n")
      .filter(cue => !cue.startsWith("WEBVTT") && !cue.startsWith("NOTE"));
    return cueStrs.map(cueStr => {
      const m: RegExpExecArray = time.regex.exec(cueStr)!;
      return {
        id: m[time.groups.id],
        start: this.parseTime(m[time.groups.start]),
        end: this.parseTime(m[time.groups.end]),
        attr: m[time.groups.attr],
        content: m[time.groups.content]
      } as ISubtitleCueObj;
    });
  }

  write(cues: ISubtitleCueObj[]): string {
    throw new Error("Method not implemented.");
  }

  parseTime(timeStr: string): number {
    throw new Error("Not Implements");
  }
}