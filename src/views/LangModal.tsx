import * as React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import MatIcon from '../components/MatIcon';
import LangsContext from '../contexts/LangsContext';
import type { LangObj } from '../objs/LangObj';

export declare interface LangModalProps {
	onClose: () => void;
}

let langListCache: LangObj[] | undefined = undefined;

export const LangModal: React.VoidFunctionComponent<LangModalProps> = ({ onClose }) => {
	const [providedLangs, setProvidedLangs] = React.useState<LangObj[]>([]);
	const { langs: selectedLangs, setLangs: setSelectedLangs } = React.useContext(LangsContext);

	React.useEffect(() => {
		if (langListCache) {
			setProvidedLangs(langListCache);
			return;
		}

		fetch('https://data.jw-api.org/mediator/v1/languages/E/web').then(response => {
			response.json().then(data => {
				const langs: LangObj[] = data.languages.map((l: any) => ({
					code: l.code,
					name: l.vernacular,
					enName: l.name,
					search: `${l.vernacular} ${l.name}`.toLowerCase(),
				}));
				langListCache = langs;
				setProvidedLangs(langs);
			});
		});
	}, [setProvidedLangs]);

	const onAddLang = React.useCallback(
		(langCode: string) => {
			const lang = providedLangs.find(l => l.code === langCode)!;
			setSelectedLangs(langs => [...langs, lang]);
		},
		[setSelectedLangs, providedLangs]
	);

	const onRemoveLang = React.useCallback(
		(langCode: string) => {
			setSelectedLangs(langs => langs.filter(lang => lang.code !== langCode));
		},
		[setSelectedLangs]
	);

	const [filter, setFilter] = React.useState('');
	const onFilterChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setFilter(evt.target.value.toLowerCase()), [setFilter]);
	const availableLangs = React.useMemo(() => {
		return providedLangs.filter(lang => (!filter || lang.search.includes(filter)) && !selectedLangs.find(l => l.code === lang.code));
	}, [selectedLangs, providedLangs, filter]);

	return (
		<div className="modal fade show d-block backdrop">
			<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" role="document">
				<div className="modal-content" style={{ height: 'clamp(400px, 80%, 1000px)' }}>
					<div className="modal-header">
						<h5 className="modal-title d-flex align-items-center">
							<MatIcon children="translate" className="me-1" />
							Language Config
						</h5>
					</div>
					<div className="modal-body container">
						{providedLangs.length === 0 ? (
							<div className="d-flex justify-content-center align-items-center w-100 h-100">
								<LoadingSpinner />
							</div>
						) : (
							<div className="row">
								<div className="col-12 col-md-6">
									<div className="card">
										<div className="card-header">Selected Languages</div>
										<LangList langs={selectedLangs} onDelete={onRemoveLang} />
									</div>
								</div>
								<div className="col-12 col-md-6 overflow-auto">
									<div className="card-header">
										Available Languages ({availableLangs.length}/{providedLangs.length})
									</div>
									<div className="input-group">
										<div className="input-group-prepend">
											<div className="input-group-text">
												<MatIcon children="search" />
											</div>
										</div>
										<input
											value={filter}
											onChange={onFilterChange}
											className="form-control"
											placeholder="Filter languages"
										/>
									</div>
									<LangList langs={availableLangs} onItemClick={onAddLang} />
								</div>
							</div>
						)}
					</div>
					<div className="modal-footer">
						<div className="btn btn-primary" onClick={onClose}>
							OK
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LangModal;

type LangListProps = {
	langs: LangObj[];
	onItemClick?: (langCode: string) => void;
	onDelete?: (langCode: string) => void;
};
const LangList: React.VoidFunctionComponent<LangListProps> = ({ langs, onItemClick, onDelete }) => {
	const onClick = React.useCallback(
		(evt: React.MouseEvent) => {
			const langCode = (evt.currentTarget as HTMLElement).dataset.langCode!;
			onItemClick?.(langCode);
		},
		[onItemClick]
	);

	const onDeleteClick = React.useCallback(
		(evt: React.MouseEvent) => {
			const langCode = (evt.currentTarget as HTMLElement).dataset.langCode!;
			onDelete?.(langCode);
		},
		[onDelete]
	);

	return (
		<ul className="list-group">
			{langs.map(lang => (
				<li
					key={lang.code}
					className={`list-group-item no-select d-flex justify-content-between align-items-center ${
						onItemClick ? 'pointer list-group-item-action' : ''
					}`}
					data-lang-code={lang.code}
					onClick={onClick}
				>
					<div>
						<div className="fw-bold">{lang.name}</div>
						{lang.enName}
					</div>
					{!!onDelete && (
						<MatIcon
							data-lang-code={lang.code}
							className="btn btn-light rounded-pill p-1"
							onClick={onDeleteClick}
							children="close"
						/>
					)}
				</li>
			))}
		</ul>
	);
};
