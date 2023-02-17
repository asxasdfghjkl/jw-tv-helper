import * as React from 'react';
import MatIcon from '../components/MatIcon';
import { WindowContext } from '../contexts/WindowContext';
import { SubtitleHelper } from '../helper/subtitle-helper';
import { FileItemObj } from '../objs/FileItemObj';

export declare interface DisplyaFilesProps {
	video: FileItemObj | undefined;
	subtitles: FileItemObj[];
	onRemoveSubtitle: (url: string) => void;
	onOpenFile: (files: File[]) => void;
}

export const DisplyaFiles: React.FunctionComponent<DisplyaFilesProps> = ({
	video,
	subtitles = [],
	onRemoveSubtitle,
	onOpenFile: onOpenFiles,
}) => {
	const onRemoveClick = React.useCallback(
		(evt: React.MouseEvent<HTMLElement>) => {
			const url = evt.currentTarget.dataset.url!;
			onRemoveSubtitle(url);
		},
		[onRemoveSubtitle]
	);

	const onFileChange = React.useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			const files = evt.currentTarget.files;
			if (!files?.length) return;

			const acceptedFiles: File[] = [];
			for (let i = 0; i < files.length; ++i) {
				const file = files.item(i)!;
				if (checkAccpetedFile(file)) {
					acceptedFiles.push(file);
				}
			}
			if (acceptedFiles.length) {
				onOpenFiles(acceptedFiles);
			} else {
				alert('Not supported files');
			}
		},
		[onOpenFiles]
	);

	const [isDragging, setIsDragging] = React.useState(false);
	const windowInfo = React.useContext(WindowContext);
	React.useEffect(() => {
		const onDragOver = (evt: DragEvent) => {
			if (evt.dataTransfer?.items.length) {
				const items = evt.dataTransfer.items;
				for (let i = 0; i < items.length; ++i) {
					if (items[i].kind === 'file') {
						evt.stopPropagation();
						evt.preventDefault();
						setIsDragging(true);
					}
				}
			}
		};

		const onDrop = (evt: DragEvent) => {
			evt.stopPropagation();
			evt.preventDefault();
			setIsDragging(false);
			if (evt.dataTransfer?.items.length) {
				const items = evt.dataTransfer.items;

				const acceptedFiles: File[] = [];
				for (let i = 0; i < items.length; ++i) {
					if (items[i].kind === 'file') {
						const file = items[i].getAsFile()!;
						if (checkAccpetedFile(file)) {
							acceptedFiles.push(file);
						}
					}
				}
				if (acceptedFiles.length) {
					onOpenFiles(acceptedFiles);
				} else {
					alert('Not supported files');
				}
			}
		};

		const onDragEnd = () => {
			setIsDragging(false);
		};

		const doc = windowInfo.currentWindow.document;
		doc.addEventListener('dragover', onDragOver);
		doc.addEventListener('drop', onDrop);
		doc.addEventListener('dragend', onDragEnd);
		return () => {
			doc.removeEventListener('dragover', onDragOver);
			doc.removeEventListener('drop', onDrop);
			doc.removeEventListener('dragend', onDragEnd);
		};
	}, [onOpenFiles, windowInfo]);

	const onDragLeave = React.useCallback(() => setIsDragging(false), [setIsDragging]);
	return (
		<>
			<div className="card">
				<div className="card-header d-flex align-items-center">
					<MatIcon children="file_copy" className="me-1" />
					<span className="flex-grow-1">Player Files</span>
					<span className="btn btn-secondary d-flex align-items-center position-relative overflow-hidden rounded">
						<MatIcon children="open_in_browser" className="me-1" />
						Open Local File
						<input
							multiple
							type="file"
							accept=".mp4,.vtt"
							className="position-absolute h-100 pointer"
							style={{ opacity: 0, right: 0, width: 500 }}
							value=""
							onChange={onFileChange}
						/>
					</span>
				</div>
				<ul className="list-group list-group-flush">
					{!!video && <DisplayItem icon="videocam" item={video} />}
					{subtitles.map(sub => (
						<DisplayItem key={sub.url} icon="subtitles" item={sub} onRemove={onRemoveClick} />
					))}
				</ul>
			</div>

			{!!isDragging && (
				<div
					id="drag-overlay"
					className="position-fixed vw-100 vh-100 text-light fs-1 p-4"
					style={{ left: 0, top: 0, background: '#000c', zIndex: 100 }}
					onDragLeave={onDragLeave}
				>
					<div
						className="w-100 h-100 d-flex justify-content-center align-items-center border-light rounded"
						style={{ border: '5px dashed white', pointerEvents: 'none' }}
					>
						<div className="spinner-grow me-2" role="status" />
						Drop <strong className="mx-2">video(.mp4)</strong> or <strong className="mx-2"> subtitle(.vtt) </strong> files to
						open in the player
					</div>
				</div>
			)}
		</>
	);
};

export default DisplyaFiles;

type DisplayItemProps = {
	icon: string;
	item: FileItemObj;
	onRemove?: (evt: React.MouseEvent<HTMLElement>) => void;
};

const DisplayItem: React.VoidFunctionComponent<DisplayItemProps> = ({ icon, item, onRemove }) => {
	return (
		<li className="list-group-item d-flex justify-content-between align-items-center">
			<div className="d-flex p-2">
				<MatIcon children={icon} className="me-1" />
				{item.lang.name}
				{item.type === 'subtitle' && <SubtitleLoadingStatus url={item.url} />}
			</div>
			{!!onRemove && <MatIcon className="btn rounded-pill p-2" data-url={item.url} onClick={onRemove} children="close" />}
		</li>
	);
};

type SubtitleLoadingStatusProps = {
	url: string;
};

const SubtitleLoadingStatus: React.VoidFunctionComponent<SubtitleLoadingStatusProps> = ({ url }) => {
	React.useMemo(() => SubtitleHelper.fetchSubtitle(url).then(() => setLoading(false)), [url]);

	const [isLoading, setLoading] = React.useState(true);
	if (isLoading) {
		return (
			<div className="spinner-border mx-1" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		);
	}

	return null;
};

function checkAccpetedFile(file: File) {
	return /\.(vtt|mp4)$/.test(file.name);
}
