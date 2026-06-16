import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, ToolEditorPanel} from "../../../components";
import {PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout";
import {SCHEMA_LINES, CODE_LINES, TOOL_PARAMS, CHIP_WEATHER} from "./_local";
import {TriageChain, CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3} from "../../module-5-agents/scenes/_v3";

// Scene 4 — onto the table. Save Tool dips, the editor leaves, the world
// undims — and a fourth chip grows onto the agent's tool line (the docs'
// "appears alongside built-in tools"), takes one selection pulse, settles.
export const OntoTheTableScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const savePress = interpolate(t, [0.5, 1.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const panelOut = interpolate(t, [1.3, 2.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.in,
	});

	const undim = interpolate(t, [1.7, 2.5], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const chipReveal = interpolate(t, [3.1, 4.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const chipPulse = interpolate(t, [4.0, 4.3, 5.1, 5.5], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{dim: undim}}
				mid={{dim: undim}}
				response={{dim: undim}}
				edge1={{opacity: 1 - 0.75 * undim}}
				edge2={{opacity: 1 - 0.75 * undim}}
				gifts={{
					tools: [
						CHIP_DOCS,
						CHIP_CRM,
						CHIP_SEARCH_V3,
						{...CHIP_WEATHER, opacity: chipReveal, ring: chipPulse},
					],
				}}
			/>
			{panelOut < 1 ? (
				<ToolEditorPanel
					x={PANEL_X}
					y={PANEL_Y}
					scale={PANEL_SCALE}
					opacity={1 - panelOut}
					slide={1 - panelOut}
					tab={1}
					schemaLines={SCHEMA_LINES}
					codeLines={CODE_LINES}
					params={TOOL_PARAMS}
					schemaReveal={1}
					codeReveal={1}
					savePress={savePress}
				/>
			) : null}
		</AbsoluteFill>
	);
};
