import * as React from 'react';
import LangsContext from '../contexts/LangsContext';
import { ParsedSubtitleTrack, SubtitleHelper } from '../helper/subtitle-helper';
import { FileItemObj } from '../objs/FileItemObj';
import {
	DEFAULT_SUBTITLE_SETTINGS,
	HEIGHT_BASED_SUBTITLE_SETTINGS_STORAGE_KEY,
	LEGACY_SUBTITLE_SETTINGS_STORAGE_KEY,
	migrateHeightBasedSubtitleSettings,
	migrateLegacySubtitleSettings,
	migrateWidthBasedSubtitleSettings,
	normalizeSubtitleSettings,
	SubtitleSettings,
	SUBTITLE_SETTINGS_STORAGE_KEY,
	WIDTH_BASED_SUBTITLE_SETTINGS_STORAGE_KEY,
} from '../objs/SubtitleSettings';
import DisplayList from './DisplayList';
import MediaInfoBox from './MediaInfoBox';
import VideoPlayer from './VideoPlayer';

export const Content: React.VoidFunctionComponent = () => {
	const [videoFile, setVideoFile] = React.useState<FileItemObj>();
	const [subtitleFiles, setSubtitleFiles] = React.useState<FileItemObj[]>([]);
	const [subtitleTracks, setSubtitleTracks] = React.useState<ParsedSubtitleTrack[]>([]);
	const [subtitleSettings, setSubtitleSettings] = React.useState<SubtitleSettings>(() => {
		try {
			const savedSettings = window.localStorage.getItem(SUBTITLE_SETTINGS_STORAGE_KEY);
			if (savedSettings) return normalizeSubtitleSettings(JSON.parse(savedSettings));

			const heightBasedSettings = window.localStorage.getItem(HEIGHT_BASED_SUBTITLE_SETTINGS_STORAGE_KEY);
			if (heightBasedSettings) return migrateHeightBasedSubtitleSettings(JSON.parse(heightBasedSettings));

			const widthBasedSettings = window.localStorage.getItem(WIDTH_BASED_SUBTITLE_SETTINGS_STORAGE_KEY);
			if (widthBasedSettings) return migrateWidthBasedSubtitleSettings(JSON.parse(widthBasedSettings));

			const legacySettings = window.localStorage.getItem(LEGACY_SUBTITLE_SETTINGS_STORAGE_KEY);
			return legacySettings ? migrateLegacySubtitleSettings(JSON.parse(legacySettings)) : DEFAULT_SUBTITLE_SETTINGS;
		} catch {
			return DEFAULT_SUBTITLE_SETTINGS;
		}
	});

	React.useEffect(() => {
		try {
			window.localStorage.setItem(SUBTITLE_SETTINGS_STORAGE_KEY, JSON.stringify(subtitleSettings));
		} catch {
			// The player can still use the settings when storage is unavailable.
		}
	}, [subtitleSettings]);

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
		let cancelled = false;

		if (!subtitleFiles.length) {
			setSubtitleUrl(undefined);
			setSubtitleTracks([]);
			return () => {
				cancelled = true;
			};
		}

		Promise.all(subtitleFiles.map(file => SubtitleHelper.fetchSubtitle(file.url))).then(subtitles => {
			if (cancelled) return;

			const content = SubtitleHelper.mergeSubtitles(subtitles);
			const blob = new Blob([content], { type: 'text/vtt;charset=utf-8' });
			const objectUrl = URL.createObjectURL(blob);
			setSubtitleTracks(
				subtitles.map((subtitle, index) => ({
					id: subtitleFiles[index].url,
					cues: SubtitleHelper.parseSubtitle(subtitle),
				}))
			);
			setSubtitleUrl(objectUrl);
		});

		return () => {
			cancelled = true;
		};
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
							<VideoPlayer
								videoUrl={videoFile?.url}
								subtitleUrl={subtitleUrl}
								subtitleTracks={subtitleTracks}
								subtitleSettings={subtitleSettings}
							/>
						</div>
						<div className="col-12 col-lg-4">
							<DisplayList
								video={videoFile}
								subtitles={subtitleFiles}
								subtitleSettings={subtitleSettings}
								onSubtitleSettingsChange={setSubtitleSettings}
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
