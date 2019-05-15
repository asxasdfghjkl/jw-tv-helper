export declare interface IVideoInfoApiObj {
  media: IVideoInfoObj[];
}

export declare interface IVideoInfoObj {
  availableLanguages: string[];
  description: string;
  duration: number;
  durationFormattedHHMM: string;
  durationFormattedMinSec: string;
  files: IVideoFileObj[];
  firstPublished: string; // date string
  images: any;
  languageAgnosticNaturalKey: string;
  naturalKey: string;
  primaryCategory: string;
  tags: string[];
  title: string;
  type: "video";
}

export declare interface IVideoFileObj {
  bitRate: number;
  checksum: string;
  duration: number;
  filesize: number;
  flashStreamingUrl: string;
  frameHeight: number;
  frameRate: number;
  frameWidth: number;
  label: string;
  mimetype: string;
  modifiedDatetime: string; // date string
  progressiveDownloadURL: string;
  subtitled: boolean;
  subtitles: IVideoSubtitleObj[];
}

export declare interface IVideoSubtitleObj {
  checksum: string;
  modifiedDatetime: string; // date string
  url: string;
}

