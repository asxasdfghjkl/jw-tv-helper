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
				const { innerWidth: winWidth, innerHeight: winHeight, scrollX, scrollY } = win.currentWindow;
				const { clientWidth: docWidth, clientHeight: docHeight } = win.currentWindow.document.documentElement;
				const { clientWidth: menuWidth, clientHeight: menuHeight } = menuRef.current;
				const vw = Math.min(docWidth || 0, winWidth || 0);
				const vh = Math.min(docHeight || 0, winHeight || 0);

				const trans: string[] = [];

				if (menuWidth + location.x >= vw + scrollX) trans.push('translateX(-100%)');
				if (menuHeight + location.y >= vh + scrollY) trans.push('translateY(-100%)');

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
