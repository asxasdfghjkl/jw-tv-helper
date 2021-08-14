import * as React from 'react';

export type WindowContextObj = {
	currentWindow: Window;
	isParent: boolean;
};

export const WindowContext = React.createContext<WindowContextObj>({
	currentWindow: window,
	isParent: true,
});
