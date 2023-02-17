import * as React from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MediaInfoContext } from '../../contexts/MediaInfoContext';
import type { FileItemObj, FileItemType } from '../../objs/FileItemObj';
import type { LangObj } from '../../objs/LangObj';
import type { MediaInfoObj } from '../../objs/MediaInfoObj';
import { FileButton } from './FileButton';

export declare interface MediaInfoBoxProps {
	lang: LangObj;
	onSelectFile: (file: FileItemObj) => void;
}

export const MediaInfoBox: React.FunctionComponent<MediaInfoBoxProps> = ({ lang, onSelectFile }) => {
	const mediaInfo = React.useContext(MediaInfoContext);

	const [info, setInfo] = React.useState<MediaInfoObj>();
	const [status, setStatus] = React.useState<boolean | string>(true);

	React.useEffect(() => {
		mediaInfo
			.getFilesInfo(lang)
			.then(setInfo)
			.then(() => setStatus(false))
			.catch(error => {
				setStatus(error.message ?? 'Error or video not avaialable in this language yet.');
			});
	}, [mediaInfo, lang]);

	const onClickFile = React.useCallback(
		(evt: React.MouseEvent<HTMLAnchorElement>) => {
			evt.stopPropagation();
			evt.preventDefault();
			const url = evt.currentTarget.href;
			const type = evt.currentTarget.dataset.type! as FileItemType;
			onSelectFile({ lang, url, type });
		},
		[onSelectFile, lang]
	);

	return (
		<div className="card">
			<div className="card-header">
				<div className="text-truncate">[{lang.name}]</div>
				{info && <div className="fw-bold text-truncate">{info.title}</div>}
			</div>
			{!info ? (
				<div className="card-body">{typeof status === 'string' ? status : <LoadingSpinner />}</div>
			) : (
				<ul className="list-group list-group-flush text-truncate">
					{info.files.map(file => (
						<li key={file.label} className="list-group-item d-flex justify-content-between align-items-center no-select">
							<span>{file.label}</span>
							<div>
								<FileButton url={file.videoLink} onClick={onClickFile} type="video" />
								<FileButton url={file.subtitleLink} onClick={onClickFile} type="subtitle" />
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MediaInfoBox;
