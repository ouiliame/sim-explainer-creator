import {Easing} from "remotion";

export const FPS = 60;

// Color tokens live in palettes.ts — both themes ported from the product
// CSS. COLORS resolves themed keys through CSS variables set by
// ThemeProvider (dark is the default everywhere).
export {COLORS, PALETTES, themeVars} from "./palettes";
export type {Palette, ThemeName} from "./palettes";
export {ThemeProvider, useCanvasDotsEnabled, usePalette, useTheme} from "./ThemeProvider";

export const SPACING = {
	xs: 8,
	sm: 16,
	md: 24,
	lg: 40,
	xl: 64,
	xxl: 96,
} as const;

// Sim uses tight radii — rounded-sm and rounded-xs dominate the UI.
export const RADIUS = {
	xs: 2,
	sm: 4,
	md: 8,
	lg: 12,
	xl: 20,
} as const;

const FONT_STACK =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif';
const MONO_STACK =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Sizes tuned for a YouTube explainer (1920×1080, viewed at 720p–1080p on phones).
// Bumped ~40-50% vs typical UI sizes so text is legible at YouTube viewing distances.
export const TYPE = {
	display: {fontFamily: FONT_STACK, fontWeight: 600, fontSize: 104, letterSpacing: -0.5},
	title: {fontFamily: FONT_STACK, fontWeight: 600, fontSize: 68, letterSpacing: -0.3},
	heading: {fontFamily: FONT_STACK, fontWeight: 500, fontSize: 44, letterSpacing: -0.2},
	body: {fontFamily: FONT_STACK, fontWeight: 400, fontSize: 30},
	label: {fontFamily: FONT_STACK, fontWeight: 500, fontSize: 24, letterSpacing: 0.1},
	micro: {fontFamily: FONT_STACK, fontWeight: 500, fontSize: 18, letterSpacing: 0.4},
	mono: {fontFamily: MONO_STACK, fontWeight: 400, fontSize: 24},
} as const;

export const SHADOW = {
	card: "0 1px 3px rgba(0,0,0,0.04)",
	subtle: "0 2px 4px 0 rgba(0,0,0,0.08)",
	medium: "0 4px 12px rgba(0,0,0,0.1)",
	overlay: "0 16px 48px rgba(0,0,0,0.15)",
} as const;

export const EASING = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	in: Easing.bezier(0.5, 0, 0.75, 0),
} as const;

export const DURATION = {
	fast: 0.25,
	base: 0.5,
	slow: 0.9,
} as const;

export const seconds = (s: number) => Math.round(s * FPS);
