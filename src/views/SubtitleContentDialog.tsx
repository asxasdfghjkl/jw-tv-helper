import * as React from 'react';
import { createPortal } from 'react-dom';
import { WindowContext } from '../contexts/WindowContext';
import { SubtitleHelper } from '../helper/subtitle-helper';
import { saveAs } from 'file-saver';

export declare interface SubtitleContentDialogProps {
	url: string;
	extract?: boolean;
	onClose: () => void;
}

export const SubtitleContentDialog: React.VoidFunctionComponent<SubtitleContentDialogProps> = ({ url, onClose, extract }) => {
	const win = React.useContext(WindowContext);

	const [content, setContent] = React.useState('');

	React.useEffect(() => {
		SubtitleHelper.fetchSubtitle(url).then(subtitle => {
			if (extract) {
				let cues = subtitle.split('\r\n\r\n');
				cues.shift();
				cues = cues.map(cue => {
					const lines = cue.split('\r\n');
					lines.shift();
					return lines.join('\n');
				});
				setContent(cues.join('\n'));
			} else {
				setContent(subtitle);
			}
		});
	}, [url, extract]);

	const onSave = () => {
		const fileName = /\/(\w+)\.vtt$/.exec(url)?.[1] || 'subtitle';
		const ext = extract ? 'txt' : 'vtt';
		saveAs(new Blob([content]), `${fileName}.${ext}`);
	};

	return createPortal(
		<div className="modal fade show d-block">
			<div className="modal-dialog modal-fullscreen">
				<div className="modal-content">
					<div className="modal-body">
						<textarea className="form-control h-100" readOnly value={content} />
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={onSave}>
							Save
						</button>
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>,
		win.win.document.body
	);
};

export default SubtitleContentDialog;
