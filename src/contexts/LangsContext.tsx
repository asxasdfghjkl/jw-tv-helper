import * as React from 'react';
import { LangObj } from '../objs/LangObj';

export type LagnsContextObj = {
	langs: LangObj[];
	setLangs: React.Dispatch<React.SetStateAction<LangObj[]>>;
};

export const LangsContext = React.createContext<LagnsContextObj>(null as any);

const STOREKEY_LANGS = 'tv-helper-langs';

export const LangsContextHandler: React.FunctionComponent = ({ children }) => {
	const [langs, setLangs] = React.useState<LangObj[]>(() => {
		const savedValue = localStorage[STOREKEY_LANGS];
		if (!savedValue) return [];
		try {
			const parsedValue = JSON.parse(savedValue);
			if (!(parsedValue instanceof Array)) return [];
			return parsedValue.filter(lang => !!lang);
		} catch {
			return [];
		}
	});

	React.useEffect(() => {
		localStorage[STOREKEY_LANGS] = JSON.stringify(langs);
	}, [langs]);

	return <LangsContext.Provider value={{ langs, setLangs }}>{children}</LangsContext.Provider>;
};

export default LangsContext;
