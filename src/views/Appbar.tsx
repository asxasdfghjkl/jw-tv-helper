import * as React from 'react';
import MatIcon from '../components/MatIcon';
import LangsContext from '../contexts/LangsContext';
import { WindowContext } from '../contexts/WindowContext';
import LangModal from './LangModal';

export declare interface AppbarProps {}

export const Appbar: React.FunctionComponent<AppbarProps> = props => {
	const [showLangModal, setShowLangModal] = React.useState(false);
	const { langs } = React.useContext(LangsContext);

	React.useEffect(
		() => {
			if (langs.length === 0) {
				setShowLangModal(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const windowInfo = React.useContext(WindowContext);
	const onClose = React.useCallback(() => {
		if (windowInfo.isParent) {
			windowInfo.win.location.reload();
		} else {
			windowInfo.win.close();
		}
	}, [windowInfo]);
	return (
		<nav className="navbar navbar-dark bg-primary">
			<div className="container-fluid">
				<span className="navbar-brand d-flex align-items-center">
					<MatIcon className="btn btn-primary rounded-pill p-2 me-2" onClick={onClose} children="close" />
					JW Video Helper
				</span>
				<div className="navbar-actions">
					<MatIcon className="btn btn-primary rounded-pill p-2" onClick={() => setShowLangModal(true)} children="translate" />
				</div>
			</div>
			{showLangModal && <LangModal onClose={() => setShowLangModal(false)} />}
		</nav>
	);
};

export default Appbar;
