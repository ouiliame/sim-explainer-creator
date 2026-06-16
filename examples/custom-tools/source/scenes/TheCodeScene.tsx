import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, ToolEditorPanel} from "../../../components";
import {PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout";
import {SCHEMA_LINES, CODE_LINES, TOOL_PARAMS} from "./_local";
import {TriageChain, CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3} from "../../module-5-agents/scenes/_v3";

// Scene 3 — the code. The tab indicator slides to Code (panel height never
// changes); the docs' function body reveals. The product's own teaching
// surfaces carry the beats by synchrony: the `city` badge pulses while
// ${city} takes the selection wash (schema param = code variable, two
// surfaces, one meaning), then units, then {{OPENWEATHER_API_KEY}} (already
// env-var blue), then the return block — what the agent gets back.
export const TheCodeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const tab = interpolate(t, [0.6, 1.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const codeReveal = interpolate(t, [1.5, 2.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const wash = (a: number, b: number, c: number, d: number) =>
		interpolate(t, [a, b, c, d], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	const cityW = wash(3.5, 3.9, 4.9, 5.3);
	const unitsW = wash(5.5, 5.9, 6.7, 7.1);

	const glow = {
		"p-city": cityW,
		"p-units": unitsW,
		env: wash(7.7, 8.1, 9.1, 9.5),
		ret: wash(9.9, 10.3, 11.3, 11.7),
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{dim: 1}}
				mid={{dim: 1}}
				response={{dim: 1}}
				edge1={{opacity: 0.25}}
				edge2={{opacity: 0.25}}
				gifts={{tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3]}}
			/>
			<ToolEditorPanel
				x={PANEL_X}
				y={PANEL_Y}
				scale={PANEL_SCALE}
				tab={tab}
				schemaLines={SCHEMA_LINES}
				codeLines={CODE_LINES}
				params={TOOL_PARAMS}
				schemaReveal={1}
				codeReveal={codeReveal}
				glow={glow}
				paramGlow={{city: cityW, units: unitsW}}
			/>
		</AbsoluteFill>
	);
};
