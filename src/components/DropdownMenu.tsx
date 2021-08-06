import * as React from 'react';
import { createPortal } from 'react-dom';
import { WindowContext } from '../contexts/WindowContext';
export declare interface DropdownMenuProps {
	location: { x: number; y: number };
	onClose: () => void;
}

export const DropdownMenu: React.FunctionComponent<DropdownMenuProps> = ({ children, location, onClose }) => {
	const win = React.useContext(WindowContext);

	return createPortal(
		<div
			className="position-fixed top-0 vw-100 vh-100"
			onClick={onClose}
			onContextMenu={evt => {
				evt.stopPropagation();
				evt.preventDefault();
				onClose();
			}}
		>
			<ul className="dropdown-menu position-fixed show" style={{ left: location.x, top: location.y }}>
				{children}
			</ul>
		</div>,
		win.win.document.body
	);
};

export default DropdownMenu;
