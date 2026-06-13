import {measureText} from "@remotion/layout-utils";

// Programmatic text measurement (@remotion/layout-utils) so layout math can
// COMPUTE what previously had to be discovered by rendering ("the rasterizer
// decides"). Render-verification still applies — this narrows the guess, it
// doesn't replace looking.

const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';

const cache = new Map<string, number>();

/** Width of a text run in SimBlock's font at the given px size. */
export const textWidth = (text: string, fontSize: number, fontWeight = "400"): number => {
	const key = `${text}|${fontSize}|${fontWeight}`;
	const hit = cache.get(key);
	if (hit !== undefined) return hit;
	const {width} = measureText({text, fontFamily: FONT, fontSize, fontWeight});
	cache.set(key, width);
	return width;
};

/**
 * Natural width of a SimBlock tool chip (×1.5 scale): icon box 24 + gap 7.5 +
 * label + horizontal padding 18 + borders 2. Used to drive the width-growth
 * reveal exactly and to plan wrap-line composition in layout files.
 */
export const chipNaturalWidth = (name: string): number =>
	24 + 7.5 + textWidth(name, 18) + 18 + 2;
