export interface SubtitleSettings {
	fontSize: number;
	spacing: number;
	color: string;
}

export const SUBTITLE_SETTINGS_STORAGE_KEY = 'jw-tv-helper:subtitle-settings:v1';

export const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
	fontSize: 28,
	spacing: 8,
	color: '#ffffff',
};

export function normalizeSubtitleSettings(settings: Partial<SubtitleSettings> | undefined): SubtitleSettings {
	const fontSize = Number(settings?.fontSize);
	const spacing = Number(settings?.spacing);
	const color = settings?.color;

	return {
		fontSize: Number.isFinite(fontSize) ? Math.min(72, Math.max(12, fontSize)) : DEFAULT_SUBTITLE_SETTINGS.fontSize,
		spacing: Number.isFinite(spacing) ? Math.min(32, Math.max(0, spacing)) : DEFAULT_SUBTITLE_SETTINGS.spacing,
		color: typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : DEFAULT_SUBTITLE_SETTINGS.color,
	};
}
