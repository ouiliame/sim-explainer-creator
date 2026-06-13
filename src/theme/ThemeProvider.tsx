import React, {createContext, useContext} from "react";
import {AbsoluteFill} from "remotion";
import {PALETTES, themeVars, type Palette, type ThemeName} from "./palettes";

const ThemeContext = createContext<ThemeName>("dark");
// Canvas dot grid toggle — default OFF (founders' call, 2026-06-11). The
// scenes keep their <CanvasDots/> mounts; this flips whether they draw.
const DotsContext = createContext<boolean>(false);
export const useCanvasDotsEnabled = (): boolean => useContext(DotsContext);

export const useTheme = (): ThemeName => useContext(ThemeContext);

/** Concrete hex palette for the active theme. Use ONLY where color math
 * happens (interpolateColors, hex-alpha suffixes on themed tokens) —
 * everything else should keep using COLORS, which resolves via CSS vars. */
export const usePalette = (): Palette => PALETTES[useTheme()];

export const ThemeProvider: React.FC<{
	theme?: ThemeName;
	dots?: boolean;
	children: React.ReactNode;
}> = ({theme = "dark", dots = false, children}) => (
	<ThemeContext.Provider value={theme}>
		<DotsContext.Provider value={dots}>
			<AbsoluteFill style={themeVars(theme) as React.CSSProperties}>{children}</AbsoluteFill>
		</DotsContext.Provider>
	</ThemeContext.Provider>
);
