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
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
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

	const win = window.open('');
	const winInfo: WindowContextObj = {
		win: win || window,
		isParent: !win,
	};
	winInfo.win.document.write(initialHTML);

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
		winInfo.win.document.getElementById('root')
	);
}

init();
