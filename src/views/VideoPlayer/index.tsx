import * as React from 'react';
import MatIcon from '../../components/MatIcon';
import { WindowContext } from '../../contexts/WindowContext';
import { ParsedSubtitleTrack } from '../../helper/subtitle-helper';
import { SubtitleSettings } from '../../objs/SubtitleSettings';

export declare interface VideoPlayerProps {
	videoUrl: string | undefined;
	subtitleUrl: string | undefined;
	subtitleTracks: ParsedSubtitleTrack[];
	subtitleSettings: SubtitleSettings;
}

const PLAYBACK_RATE_STEP = 0.1;

type WebkitFullscreenDocument = Document & {
	webkitExitFullscreen?: () => Promise<void> | void;
	webkitFullscreenElement?: Element;
};

type WebkitFullscreenContainer = HTMLDivElement & {
	webkitRequestFullscreen?: () => Promise<void> | void;
};

export const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({
	videoUrl,
	subtitleUrl,
	subtitleTracks,
	subtitleSettings,
}) => {
	const videoRef = React.useRef<HTMLVideoElement>(null);
	const trackRef = React.useRef<HTMLTrackElement>(null);
	const playerSurfaceRef = React.useRef<WebkitFullscreenContainer>(null);
	const [activeSubtitles, setActiveSubtitles] = React.useState<{ id: string; text: string }[]>([]);
	const [isFullscreen, setIsFullscreen] = React.useState(false);
	const videoStatusRef = React.useRef({
		currentTime: 0,
		paused: true,
	});

	const [activeVideoUrl, setActiveVideoUrl] = React.useState(videoUrl);

	React.useEffect(() => {
		if (videoRef.current) {
			const { currentTime, paused } = videoRef.current;
			videoStatusRef.current = { currentTime, paused };
		}
		setActiveVideoUrl(videoUrl);
	}, [videoUrl]);

	React.useEffect(
		() => {
			if (videoRef.current && videoStatusRef.current) {
				const { currentTime, paused } = videoStatusRef.current;
				videoRef.current.currentTime = currentTime;
				videoRef.current.playbackRate = playbackRate;
				if (!paused) {
					videoRef.current.play();
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeVideoUrl]
	);

	const [playbackRate, setPlaybackRate] = React.useState(1);
	const onPlaybackRateChange = React.useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			const rate = parseFloat(evt.target.value);
			setPlaybackRate(rate);
		},
		[setPlaybackRate]
	);
	React.useEffect(() => {
		if (videoRef.current) {
			videoRef.current.playbackRate = playbackRate;
		}
	}, [playbackRate]);

	React.useEffect(() => {
		if (trackRef.current) {
			trackRef.current.track.mode = 'hidden';
		}
	}, [subtitleUrl]);

	React.useEffect(() => {
		const surface = playerSurfaceRef.current;
		if (!surface) return;

		const document = surface.ownerDocument as WebkitFullscreenDocument;
		const handleFullscreenChange = () => {
			const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
			setIsFullscreen(fullscreenElement === surface);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
		};
	}, []);

	const toggleFullscreen = React.useCallback(async () => {
		const surface = playerSurfaceRef.current;
		if (!surface) return;

		const document = surface.ownerDocument as WebkitFullscreenDocument;
		const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

		try {
			if (fullscreenElement) {
				if (document.exitFullscreen) {
					await document.exitFullscreen();
				} else {
					await document.webkitExitFullscreen?.();
				}
			} else if (surface.requestFullscreen) {
				await surface.requestFullscreen();
			} else {
				await surface.webkitRequestFullscreen?.();
			}
		} catch (error) {
			console.error('Unable to toggle fullscreen mode', error);
		}
	}, []);

	React.useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateActiveSubtitles = () => {
			const currentTime = video.currentTime;
			setActiveSubtitles(
				subtitleTracks.flatMap(track => {
					const text = track.cues
						.filter(cue => cue.startTime <= currentTime && cue.endTime > currentTime)
						.map(cue => cue.text)
						.join('\n');
					return text ? [{ id: track.id, text }] : [];
				})
			);
		};

		updateActiveSubtitles();
		video.addEventListener('timeupdate', updateActiveSubtitles);
		video.addEventListener('seeked', updateActiveSubtitles);
		video.addEventListener('loadedmetadata', updateActiveSubtitles);
		return () => {
			video.removeEventListener('timeupdate', updateActiveSubtitles);
			video.removeEventListener('seeked', updateActiveSubtitles);
			video.removeEventListener('loadedmetadata', updateActiveSubtitles);
		};
	}, [activeVideoUrl, subtitleTracks]);

	React.useEffect(() => {
		const video = videoRef.current;
		const track = trackRef.current;
		if (!video || !track) return;

		const showNativeTrack = () => {
			track.track.mode = 'showing';
		};
		const hideNativeTrack = () => {
			track.track.mode = 'hidden';
		};
		const document = video.ownerDocument;
		const handleFullscreenChange = () => {
			if (document.fullscreenElement === video) {
				showNativeTrack();
			} else {
				hideNativeTrack();
			}
		};

		video.addEventListener('webkitbeginfullscreen', showNativeTrack);
		video.addEventListener('webkitendfullscreen', hideNativeTrack);
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			video.removeEventListener('webkitbeginfullscreen', showNativeTrack);
			video.removeEventListener('webkitendfullscreen', hideNativeTrack);
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	}, [subtitleUrl]);

	const windowInfo = React.useContext(WindowContext);
	const offsetVideoTime = React.useCallback(
		(evt: MouseEvent | KeyboardEvent, direction: 1 | -1) => {
			const video = videoRef.current;
			if (video) {
				let offset = 0;
				switch (true) {
					case evt.altKey:
						offset = direction * 5 * 60;
						break;
					case evt.ctrlKey && evt.shiftKey:
						offset = direction * 60;
						break;
					case evt.ctrlKey:
						offset = direction * 30;
						break;
					case evt.shiftKey:
						offset = direction;
						break;
					default:
						offset = direction * 5;
				}
				const f = (n: number) => Math.floor(n).toString().padStart(2, '0');
				(windowInfo.currentWindow as any).console.log(`time: ${f(video.currentTime / 60)}:${f(video.currentTime % 60)}`);
				console.log('offset', offset);
				const nextTime = video.currentTime + offset;
				video.currentTime = Number.isFinite(video.duration)
					? Math.min(video.duration, Math.max(0, nextTime))
					: Math.max(0, nextTime);
				(windowInfo.currentWindow as any).console.log(`time: ${f(video.currentTime / 60)}:${f(video.currentTime % 60)}`);
			}
		},
		[windowInfo]
	);

	React.useEffect(() => {
		const handler = (evt: KeyboardEvent) => {
			const target = evt.target as HTMLElement | null;
			if (target?.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName || '')) return;

			switch (evt.key) {
				case '+':
					setPlaybackRate(rate => rate + PLAYBACK_RATE_STEP);
					break;
				case '-':
					setPlaybackRate(rate => rate - PLAYBACK_RATE_STEP);
					break;
				case '/':
				case '*':
					setPlaybackRate(1);
					break;
				case 'ArrowLeft':
					offsetVideoTime(evt, -1);
					break;
				case 'ArrowRight':
					offsetVideoTime(evt, 1);
					break;
				default:
					return;
			}
			evt.preventDefault();
			evt.stopPropagation();
		};

		const doc = windowInfo.currentWindow.document;
		doc.addEventListener('keydown', handler, true);
		return () => {
			doc.removeEventListener('keydown', handler, true);
		};
	}, [setPlaybackRate, offsetVideoTime, windowInfo]);

	return (
		<div>
			<style>{`.jw-tv-video::-webkit-media-controls-fullscreen-button { display: none !important; }`}</style>
			<div
				ref={playerSurfaceRef}
				className="d-flex justify-content-center align-items-center position-relative overflow-hidden w-100"
				style={{
					aspectRatio: isFullscreen ? undefined : '16 / 9',
					background: 'var(--bs-dark, #000000dd)',
					color: '#000',
					containerType: 'size',
					height: isFullscreen ? '100%' : undefined,
				}}
			>
					{!!activeVideoUrl ? (
						<>
							<video
								ref={videoRef}
								controls
								controlsList="nofullscreen"
								playsInline
								className="jw-tv-video h-100 w-100"
								style={{ objectFit: 'contain' }}
								src={activeVideoUrl}
							>
								{!!subtitleUrl && (
								<track
									key={subtitleUrl}
									ref={trackRef}
									default
									kind="captions"
									srcLang="mul"
									label="Multiple subtitles"
									src={subtitleUrl}
									onLoad={event => {
										event.currentTarget.track.mode = 'hidden';
									}}
								/>
								)}
							</video>
							{isFullscreen && (
								<button
									type="button"
									className="btn btn-dark position-absolute d-flex align-items-center justify-content-center rounded-circle p-2"
									style={{ right: 12, top: 12, zIndex: 3 }}
									onClick={toggleFullscreen}
									aria-label="Exit fullscreen"
									title="Exit fullscreen"
								>
									<MatIcon children="fullscreen_exit" />
								</button>
							)}
							{!!activeSubtitles.length && (
								<div
									className="position-absolute d-flex flex-column align-items-center w-100 px-3"
									style={{
										bottom: '7%',
										pointerEvents: 'none',
										zIndex: 2,
									}}
									aria-live="off"
								>
									{activeSubtitles.map(subtitle => (
										<div
											key={subtitle.id}
											className="text-center"
											style={{
												color: subtitleSettings.color,
												fontSize: `${subtitleSettings.fontSize}cqh`,
												fontWeight: 600,
												lineHeight: subtitleSettings.lineHeight,
												maxWidth: '94%',
												textShadow: `0 1px 2px ${subtitleSettings.shadowColor}, 0 0 4px ${subtitleSettings.shadowColor}`,
												whiteSpace: 'pre-line',
											}}
										>
											{subtitle.text}
										</div>
									))}
								</div>
							)}
						</>
					) : (
						<MatIcon className="text-white fs-1" children="video_library" />
					)}
			</div>
			<fieldset className="mt-2">
				<div className="d-flex align-items-end gap-3">
					<div className="flex-grow-1">
						<label htmlFor="playbackRateControl" className="form-label">
							Playback Speed:
							<strong className="ms-1">{playbackRate.toFixed(1)}x</strong>
						</label>
						<input
							type="range"
							className="form-range flex-grow-1"
							id="playbackRateControl"
							min={0.1}
							value={playbackRate}
							step={PLAYBACK_RATE_STEP}
							max={3}
							onChange={onPlaybackRateChange}
							onDoubleClick={() => setPlaybackRate(1)}
						/>
					</div>
					<button
						type="button"
						className="btn btn-secondary d-flex align-items-center mb-1"
						onClick={toggleFullscreen}
						disabled={!activeVideoUrl}
					>
						<MatIcon children="fullscreen" className="me-1" />
						Fullscreen
					</button>
				</div>
			</fieldset>
		</div>
	);
};

export default VideoPlayer;
