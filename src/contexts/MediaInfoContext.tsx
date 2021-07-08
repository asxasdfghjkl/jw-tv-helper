import * as React from 'react';
import { MediaParser } from '../PageParsers/MediaParser';

export type MediaInfoContextObj = MediaParser;

export const MediaInfoContext = React.createContext<MediaInfoContextObj>(undefined as any);

export declare interface MediaInfoContextHandlerProps {
	mediaParser: MediaParser;
}

export const MediaInfoContextHandler: React.FunctionComponent<MediaInfoContextHandlerProps> = ({ mediaParser, children }) => {
	return <MediaInfoContext.Provider value={mediaParser}>{children}</MediaInfoContext.Provider>;
};

export default MediaInfoContextHandler;
