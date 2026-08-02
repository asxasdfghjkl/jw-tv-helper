export interface SubtitleSettings {
	fontSize: number;
	lineHeight: number;
	color: string;
	shadowColor: string;
}

type LegacySubtitleSettings = Partial<SubtitleSettings> & { spacing?: number };

export const SUBTITLE_SETTINGS_STORAGE_KEY = 'jw-tv-helper:subtitle-settings:v4';
export const HEIGHT_BASED_SUBTITLE_SETTINGS_STORAGE_KEY = 'jw-tv-helper:subtitle-settings:v3';
export const WIDTH_BASED_SUBTITLE_SETTINGS_STORAGE_KEY = 'jw-tv-helper:subtitle-settings:v2';
export const LEGACY_SUBTITLE_SETTINGS_STORAGE_KEY = 'jw-tv-helper:subtitle-settings:v1';

export const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
	fontSize: 5,
	lineHeight: 1.2,
	color: '#ffffff',
	shadowColor: '#000000',
};

export function normalizeSubtitleSettings(settings: Partial<SubtitleSettings> | undefined): SubtitleSettings {
	const fontSize = Number(settings?.fontSize);
	const lineHeight = Number(settings?.lineHeight);
	const color = settings?.color;
	const shadowColor = settings?.shadowColor;

	return {
		fontSize: Number.isFinite(fontSize) ? Math.min(15, Math.max(2, fontSize)) : DEFAULT_SUBTITLE_SETTINGS.fontSize,
		lineHeight: Number.isFinite(lineHeight)
			? Math.min(2, Math.max(1, lineHeight))
			: DEFAULT_SUBTITLE_SETTINGS.lineHeight,
		color: typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? color : DEFAULT_SUBTITLE_SETTINGS.color,
		shadowColor:
			typeof shadowColor === 'string' && /^#[0-9a-f]{6}$/i.test(shadowColor)
				? shadowColor
				: DEFAULT_SUBTITLE_SETTINGS.shadowColor,
	};
}

export function migrateHeightBasedSubtitleSettings(settings: LegacySubtitleSettings | undefined): SubtitleSettings {
	return normalizeSubtitleSettings({
		...settings,
		lineHeight: DEFAULT_SUBTITLE_SETTINGS.lineHeight,
	});
}

export function migrateWidthBasedSubtitleSettings(settings: LegacySubtitleSettings | undefined): SubtitleSettings {
	return normalizeSubtitleSettings({
		...settings,
		fontSize: Number(settings?.fontSize) * (16 / 9),
		lineHeight: DEFAULT_SUBTITLE_SETTINGS.lineHeight,
	});
}

export function migrateLegacySubtitleSettings(settings: LegacySubtitleSettings | undefined): SubtitleSettings {
	return normalizeSubtitleSettings({
		...settings,
		fontSize: (Number(settings?.fontSize) / 10) * (16 / 9),
		lineHeight: DEFAULT_SUBTITLE_SETTINGS.lineHeight,
		shadowColor: DEFAULT_SUBTITLE_SETTINGS.shadowColor,
	});
}
