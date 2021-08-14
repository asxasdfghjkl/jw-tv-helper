import * as React from 'react';
import { createPortal } from 'react-dom';
import { WindowContext } from '../contexts/WindowContext';
export declare interface DropdownMenuProps {
	location: { x: number; y: number };
	onClose: () => void;
}

export const DropdownMenu: React.FunctionComponent<DropdownMenuProps> = ({ children, location, onClose }) => {
	const win = React.useContext(WindowContext);

	const menuRef = React.useRef<HTMLUListElement>(null);
	const [transform, setTransform] = React.useState('none');

	// React.useLayoutEffect(() => {
	// 	const scrollbar =
	// 		win.currentWindow.innerHeight < win.currentWindow.document.body.clientHeight ? 'overflow-y-scroll overflow-x-hidden' : '';
	// 	if (scrollbar) {
	// 		win.currentWindow.document.body.classList.add(scrollbar);
	// 	}
	// 	return () => {
	// 		if(scrollbar){
	// 			win.currentWindow.document.body.classList.remove(scrollbar);
	// 		}
	// 	};
	// }, [win]);

	React.useLayoutEffect(() => {
		const handler = () => {
			if (menuRef.current) {
				const { innerWidth: windowWidth, innerHeight: windowHeight, scrollX, scrollY } = win.currentWindow;
				const { clientWidth: menuWidth, clientHeight: menuHeight } = menuRef.current;

				const trans: string[] = [];

				if (menuWidth + location.x >= windowWidth + scrollX) trans.push('translateX(-100%)');
				if (menuHeight + location.y >= windowHeight + scrollY) trans.push('translateY(-100%)');

				setTransform(trans.join(' ') || 'none');
			}
		};
		win.currentWindow.addEventListener('resize', handler);
		handler();
		return () => {
			win.currentWindow.removeEventListener('resize', handler);
		};
	}, [win, location.x, location.y]);

	return createPortal(
		<div>
			<div
				className="position-fixed top-0 vw-100 vh-100"
				onClick={onClose}
				onContextMenu={evt => {
					evt.stopPropagation();
					evt.preventDefault();
					onClose();
				}}
			/>
			<ul ref={menuRef} className="dropdown-menu position-absolute show" style={{ transform, left: location.x, top: location.y }}>
				{children}
			</ul>
		</div>,
		win.currentWindow.document.body
	);
};

export default DropdownMenu;
