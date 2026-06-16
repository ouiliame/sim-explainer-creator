import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, CHIP_WORKFLOW, TriageChain} from "./_v3";

// v3 scene 5 — a glance at what's ahead, on the same block: a whole workflow
// joins as a tool, then the Skills row appears. Each lands with a brief
// selection pulse and settles. Nothing runs; nothing is explained.
export const WhatsAheadScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const wrapReveal = interpolate(t, [1.0, 1.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const wfPulse = interpolate(t, [1.9, 2.2, 2.9, 3.3], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const skillsReveal = interpolate(t, [4.4, 5.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const skillsPulse = interpolate(t, [5.3, 5.7, 6.6, 7.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				mid={{highlighted: skillsPulse > 0.5}}
				gifts={{
					tools: [
						CHIP_DOCS,
						CHIP_CRM,
						CHIP_SEARCH_V3,
						{...CHIP_WORKFLOW, opacity: wrapReveal, ring: wfPulse},
					],
					skillsReveal,
				}}
			/>
		</AbsoluteFill>
	);
};
