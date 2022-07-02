import * as React from 'react';
import LangsContext from '../contexts/LangsContext';
import { SubtitleHelper } from '../helper/subtitle-helper';
import { FileItemObj } from '../Objs/FileItemObj';
import DisplayList from './DisplayList';
import MediaInfoBox from './MediaInfoBox';
import VideoPlayer from './VideoPlayer';

export const Content: React.VoidFunctionComponent = () => {
	const [videoFile, setVideoFile] = React.useState<FileItemObj>();
	const [subtitleFiles, setSubtitleFiles] = React.useState<FileItemObj[]>([]);

	React.useEffect(() => {
		if (videoFile?.url.startsWith('blob:')) {
			const url = videoFile.url;
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [videoFile]);

	const onRemoveSubtitle = React.useCallback(
		(subtitleUrl: string) => {
			setSubtitleFiles(files => files.filter(file => file.url !== subtitleUrl));
			if (subtitleUrl.startsWith('blob:')) {
				URL.revokeObjectURL(subtitleUrl);
			}
		},
		[setSubtitleFiles]
	);

	const { langs } = React.useContext(LangsContext);

	const onSelectFile = React.useCallback(
		(selectedFile: FileItemObj) => {
			if (selectedFile.type === 'video') {
				setVideoFile(selectedFile);
			} else {
				setSubtitleFiles(files => {
					if (files.find(file => file.url === selectedFile.url)) return files;
					return [...files, selectedFile];
				});
			}
		},
		[setSubtitleFiles, setVideoFile]
	);

	const [subtitleUrl, setSubtitleUrl] = React.useState<string>();

	React.useEffect(() => {
		if (subtitleUrl) {
			return () => URL.revokeObjectURL(subtitleUrl);
		}
	}, [subtitleUrl]);

	React.useEffect(() => {
		Promise.all(subtitleFiles.map(file => SubtitleHelper.fetchSubtitle(file.url))).then(subtitles => {
			let content = SubtitleHelper.mergeSubtitles(subtitles);
			if (subtitles.length > 1) {
				content = SubtitleHelper.removePosition(content);
			}
			const blob = new Blob([content], { type: 'text/vtt' });
			const objectUrl = URL.createObjectURL(blob);
			setSubtitleUrl(objectUrl);
		});
	}, [subtitleFiles]);

	const onOpenLocalFile = React.useCallback(
		(files: File[]) => {
			const fileItems: FileItemObj[] = files.map(file => ({
				lang: { code: 'file', name: `File: ${file.name}`, enName: '', search: '' },
				url: URL.createObjectURL(file),
				type: file.name.endsWith('.mp4') ? 'video' : 'subtitle',
			}));
			const video = fileItems.find(file => file.type === 'video');
			if (video) {
				setVideoFile(video);
			}

			const subtitles = fileItems.filter(file => file.type === 'subtitle');
			if (subtitles.length) {
				setSubtitleFiles(subs => subs.concat(subtitles));
			}
		},
		[setSubtitleFiles, setVideoFile]
	);
	return (
		<div className="p-3">
			<div className="container" style={{ maxWidth: 1600 }}>
				<div className="tab-content p-3">
					<div className="row mb-3">
						<div className="col-12 col-lg-8">
							<VideoPlayer videoUrl={videoFile?.url} subtitleUrl={subtitleUrl} />
						</div>
						<div className="col-12 col-lg-4">
							<DisplayList
								video={videoFile}
								subtitles={subtitleFiles}
								onRemoveSubtitle={onRemoveSubtitle}
								onOpenFile={onOpenLocalFile}
							/>
						</div>
					</div>
					<div className="row">
						{langs.map(lang => (
							<div key={lang.code} className="col-12 col-md-6 col-xl-4 my-3">
								<MediaInfoBox lang={lang} onSelectFile={onSelectFile} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
