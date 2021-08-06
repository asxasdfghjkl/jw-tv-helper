import MatIcon from '../../components/MatIcon';
import React from 'react';
import DropdownMenu from '../../components/DropdownMenu';
import SubtitleContentDialog from '../SubtitleContentDialog';

export type FileButtonProps = {
	url: string | undefined;
	type: 'video' | 'subtitle';
	onClick: React.MouseEventHandler;
};

export const FileButton: React.VoidFunctionComponent<FileButtonProps> = ({ url, type, onClick }) => {
	const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number }>();
	const [subtitleDialog, setSubtitleDialog] = React.useState<'file' | 'extract'>();

	const onContextMenu = React.useCallback(
		(evt: React.MouseEvent) => {
			evt.preventDefault();
			evt.stopPropagation();
			if (url) {
				setContextMenu({ x: evt.pageX, y: evt.pageY });
			}
		},
		[url, setContextMenu]
	);
	return (
		<>
			<a
				className={`btn btn-secondary me-2 lh-1 ${url ? '' : 'disabled'}`}
				href={url}
				data-type={type}
				onClick={onClick}
				onContextMenu={onContextMenu}
			>
				<MatIcon children={type === 'video' ? 'videocam' : 'subtitles'} />
			</a>
			{contextMenu && (
				<DropdownMenu location={contextMenu} onClose={() => setContextMenu(undefined)}>
					<li>
						<a href={url} download className="dropdown-item">
							Download
						</a>
					</li>
					{type === 'subtitle' && (
						<>
							<li onClick={() => setSubtitleDialog('file')}>
								<span className="dropdown-item" style={{ cursor: 'pointer' }}>
									Open Subtitle
								</span>
							</li>
							<li onClick={() => setSubtitleDialog('extract')}>
								<span className="dropdown-item" style={{ cursor: 'pointer' }}>
									Extract Subtitle
								</span>
							</li>
						</>
					)}
				</DropdownMenu>
			)}
			{subtitleDialog && (
				<SubtitleContentDialog url={url!} extract={subtitleDialog === 'extract'} onClose={() => setSubtitleDialog(undefined)} />
			)}
		</>
	);
};
