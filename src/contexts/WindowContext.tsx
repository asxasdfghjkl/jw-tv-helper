import * as React from 'react';

export type WindowContextObj = {
	win: Window;
	isParent: boolean;
};

export const WindowContext = React.createContext<WindowContextObj>({
	win: window,
	isParent: true,
});
