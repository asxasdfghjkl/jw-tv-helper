import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LangsContextHandler } from './contexts/LangsContext';
import MediaInfoContextHandler from './contexts/MediaInfoContext';
import { WindowContext, WindowContextObj } from './contexts/WindowContext';
import { createPageParser } from './PageParsers/PageParserFactory';

const initialHTML = `
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
.material-icons,.no-select{user-select:none;}
.btn:not(.disabled),.pointer{cursor:pointer;}
.modal.backdrop{background-color:#00000088;}
</style>
<div id="root"></div>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
`;

async function init() {
	if (!['localhost', 'jw.org', 'www.jw.org'].includes(window.location.hostname)) {
		return alert(`This script doesn't support this website.`);
	}
	const pageParser = await createPageParser();
	if (!pageParser) {
		return alert(`This script can't detect video form this page.`);
	}
	const ua = navigator.userAgent.toLowerCase();
	const isWindowsOS = ua.includes('windows nt') || ua.includes('win64');

	const win = isWindowsOS ? window.open('') : null;
	const winInfo: WindowContextObj = {
		currentWindow: win || window,
		isParent: !win,
	};
	winInfo.currentWindow.document.write(initialHTML);
	winInfo.currentWindow.addEventListener('contextmenu', evt => evt.preventDefault());

	ReactDOM.render(
		<React.StrictMode>
			<WindowContext.Provider value={winInfo}>
				<MediaInfoContextHandler mediaParser={pageParser}>
					<LangsContextHandler>
						<App />
					</LangsContextHandler>
				</MediaInfoContextHandler>
			</WindowContext.Provider>
		</React.StrictMode>,
		winInfo.currentWindow.document.getElementById('root')
	);
}

init();
