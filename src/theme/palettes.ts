// Theme palettes — both ramps ported verbatim from the product's token
// blocks (apps/sim/app/_styles/globals.css :: .dark and :root/.light, plus
// the docs' .wp-scope variables for chip surfaces). Never invent a value:
// if the product doesn't define it for a theme, it doesn't go here.

// Tokens that change between themes. COLORS exposes these as CSS variables
// so the active theme is decided once, by ThemeProvider, not at every
// call site. Anything doing color MATH (interpolateColors, hex-alpha
// suffixes) must use usePalette() to get concrete hexes instead.
const THEMED = {
	dark: {
		bg: "#1b1b1b",
		surface1: "#1e1e1e",
		surface2: "#232323",
		surface3: "#242424",
		surface4: "#292929",
		surface5: "#363636",
		surface6: "#454545",
		surface7: "#505050",
		surfaceActive: "#2c2c2c",

		border: "#333333",
		border1: "#3d3d3d",
		divider: "#393939",
		borderMuted: "#424242",

		text: "#e6e6e6",
		textSecondary: "#cccccc",
		textTertiary: "#b3b3b3",
		textBody: "#cdcdcd",
		textMuted: "#787878",
		textSubtle: "#7d7d7d",
		textIcon: "#939393",
		textPlaceholder: "#8d8d8d",

		brand: "#701ffc",
		brandHover: "#802fff",
		brandSoft: "rgba(112, 31, 252, 0.18)",
		selection: "#4b83f7",
		warning: "#ff6600",
		error: "#f87171",

		// --workflow-edge: wires + connection handles
		wire: "#454545",
		// .wp-scope chip surface (tool chips, chat bubbles)
		chipBg: "#2a2a2a",
		chipText: "#cdcdcd",
	},
	light: {
		bg: "#fefefe",
		surface1: "#fbfbfb",
		surface2: "#ffffff",
		surface3: "#f7f7f7",
		surface4: "#f5f5f5",
		surface5: "#f3f3f3",
		surface6: "#e5e5e5",
		surface7: "#d9d9d9",
		surfaceActive: "#ececec",

		border: "#dedede",
		border1: "#e0e0e0",
		divider: "#ededed",
		borderMuted: "#e4e4e4",

		text: "#1a1a1a",
		textSecondary: "#525252",
		textTertiary: "#5c5c5c",
		textBody: "#3b3b3b",
		textMuted: "#707070",
		textSubtle: "#8c8c8c",
		textIcon: "#525252",
		textPlaceholder: "#8d8d8d",

		brand: "#6f3dfa",
		brandHover: "#6f3dfa",
		brandSoft: "rgba(111, 61, 250, 0.18)",
		selection: "#1a5cf6",
		warning: "#ea580c",
		error: "#dc2626",

		wire: "#e0e0e0",
		chipBg: "#f3f3f3",
		chipText: "#3b3b3b",
	},
} as const;

// Tokens identical in both themes — these stay literal hex so string math
// (`${COLORS.accent}55`) keeps working.
const INVARIANT = {
	brandInset: "#9b77ff",

	knowledge: "#00b0b0",
	knowledgeSoft: "rgba(0, 176, 176, 0.18)",

	accent: "#33c482",
	accentHover: "#2dac72",
	accentSoft: "rgba(51, 196, 130, 0.18)",

	secondary: "#33b4ff",
	secondarySoft: "rgba(51, 180, 255, 0.18)",

	success: "#22c55e",

	// Doc / connector kind palette (matches Sim's badge colors)
	docPdf: "#fca5a5",
	docMd: "#7dd3fc",
	docXls: "#86efac",
	docNotion: "#d8b4fe",
	docSlide: "#fcd34d",
	docMail: "#fbcfe8",
	docDrive: "#fdba74",
	docTxt: "#a8a8a8",

	// Legacy aliases kept so older code doesn't break.
	active: "#33c482",
	activeSoft: "rgba(51, 196, 130, 0.18)",
} as const;

export type ThemeName = keyof typeof THEMED;
export type ThemedKey = keyof typeof THEMED.dark;

const kebab = (k: string) =>
	k
		.replace(/([A-Z])/g, "-$1")
		.replace(/([0-9]+)/g, "-$1")
		.toLowerCase();

// We reuse the product's own variable names (index.css already defines the
// dark set; SimTable consumes them directly), so ThemeProvider overriding
// them re-themes ported components for free.
const varName = (k: string) =>
	k === "text" ? "text-primary" : k === "wire" ? "workflow-edge" : kebab(k);

const cssVar = (k: string) => `var(--${varName(k)})`;

const legacyAliases = <T extends Record<ThemedKey, string>>(t: T) => ({
	surface: t.surface2,
	surfaceAlt: t.surface4,
	stroke: t.border,
	strokeStrong: t.border1,
	textDim: t.textSubtle,
});

/** Concrete hex palettes per theme — for color math (interpolateColors,
 * alpha suffixes on themed tokens). Style values should use COLORS. */
export type Palette = Record<
	ThemedKey | keyof typeof INVARIANT | keyof ReturnType<typeof legacyAliases>,
	string
>;

export const PALETTES: Record<ThemeName, Palette> = {
	dark: {...THEMED.dark, ...INVARIANT, ...legacyAliases(THEMED.dark)},
	light: {...THEMED.light, ...INVARIANT, ...legacyAliases(THEMED.light)},
};

/** CSS custom properties for a theme — set by ThemeProvider on the video
 * root (and defaulted to dark in index.css as a safety net). */
export const themeVars = (theme: ThemeName): Record<string, string> =>
	Object.fromEntries(
		(Object.keys(THEMED.dark) as ThemedKey[]).map((k) => [`--${varName(k)}`, THEMED[theme][k]]),
	);

const themedVarStrings = Object.fromEntries(
	(Object.keys(THEMED.dark) as ThemedKey[]).map((k) => [k, cssVar(k)]),
) as Record<ThemedKey, string>;

// The drop-in COLORS object every component already imports. Themed keys
// resolve through CSS variables; invariant keys stay literal hex.
export const COLORS = {
	...themedVarStrings,
	...INVARIANT,
	surface: cssVar("surface2"),
	surfaceAlt: cssVar("surface4"),
	stroke: cssVar("border"),
	strokeStrong: cssVar("border1"),
	textDim: cssVar("textSubtle"),
} as const;
