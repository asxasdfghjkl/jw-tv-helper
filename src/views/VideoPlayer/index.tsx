import * as React from 'react';
import MatIcon from '../../components/MatIcon';
import { WindowContext } from '../../contexts/WindowContext';

export declare interface VideoPlayerProps {
	videoUrl: string | undefined;
	subtitleUrl: string | undefined;
}

const PLAYBACK_RATE_STEP = 0.1;

export const VideoPlayer: React.FunctionComponent<VideoPlayerProps> = ({ videoUrl, subtitleUrl }) => {
	const videoRef = React.useRef<HTMLVideoElement>(null);
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

	const offsetVideoTime = React.useCallback((evt: MouseEvent | KeyboardEvent, direction: 1 | -1) => {
		const video = videoRef.current;
		if (video) {
			switch (true) {
				case evt.ctrlKey && evt.shiftKey:
					video.currentTime += direction * 60;
					break;
				case evt.ctrlKey:
					video.currentTime += direction * 30;
					break;
				case evt.shiftKey:
					video.currentTime += direction;
					break;
				case evt.altKey:
					video.currentTime += direction * 5 * 60;
					break;
				default:
					video.currentTime += direction * 5;
			}
		}
	}, []);

	const windowInfo = React.useContext(WindowContext);
	React.useEffect(() => {
		const handler = (evt: KeyboardEvent) => {
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
		};

		const doc = windowInfo.win.document;
		doc.addEventListener('keydown', handler);
		return () => {
			doc.removeEventListener('keydown', handler);
		};
	}, [setPlaybackRate, offsetVideoTime, windowInfo]);

	return (
		<div>
			<div className="ratio ratio-16x9" style={{ background: 'var(--bs-dark, #000000dd)', color: '#000' }}>
				<div className="d-flex justify-content-center align-items-center">
					{!!activeVideoUrl ? (
						<video ref={videoRef} controls className="h-100 w-100" src={activeVideoUrl}>
							{!!subtitleUrl && <track default kind="captions" src={subtitleUrl} />}
						</video>
					) : (
						<MatIcon className="text-white fs-1" children="video_library" />
					)}
				</div>
			</div>
			<fieldset className="mt-2">
				<div className="row">
					<div className="col-12 col-md-6">
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
				</div>
			</fieldset>
		</div>
	);
};

export default VideoPlayer;
