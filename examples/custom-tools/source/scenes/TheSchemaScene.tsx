import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, ToolEditorPanel} from "../../../components";
import {PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout";
import {SCHEMA_LINES, CODE_LINES, TOOL_PARAMS} from "./_local";
import {TriageChain, CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3} from "../../module-5-agents/scenes/_v3";

// Scene 2 — the schema. The world dims and the real Create Agent Tool
// editor rises (Schema tab). The docs' get_weather schema reveals, then the
// selection wash walks the half the model reads: name → description → the
// two parameter blocks. No captions — the JSON is the artifact.
export const TheSchemaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const aside = interpolate(t, [0.3, 1.2], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const schemaReveal = interpolate(t, [1.4, 2.8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const wash = (a: number, b: number, c: number, d: number) =>
		interpolate(t, [a, b, c, d], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	const glow = {
		name: wash(3.4, 3.8, 4.8, 5.2),
		desc: wash(5.4, 5.8, 6.8, 7.2),
		city: wash(7.4, 7.8, 8.6, 9.0),
		units: wash(9.0, 9.4, 10.2, 10.6),
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{dim: aside}}
				mid={{dim: aside}}
				response={{dim: aside}}
				edge1={{opacity: 1 - 0.75 * aside}}
				edge2={{opacity: 1 - 0.75 * aside}}
				gifts={{tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3]}}
			/>
			{aside > 0 ? (
				<ToolEditorPanel
					x={PANEL_X}
					y={PANEL_Y}
					scale={PANEL_SCALE}
					opacity={aside}
					slide={aside}
					tab={0}
					schemaLines={SCHEMA_LINES}
					codeLines={CODE_LINES}
					params={TOOL_PARAMS}
					schemaReveal={schemaReveal}
					glow={glow}
				/>
			) : null}
		</AbsoluteFill>
	);
};
