import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "../../../components";
import {EconomyRig} from "./_rig";

// Scene 2 — deploy as a tool. Downstream dims; with the editing ring on,
// the entry header morphs Start → API (the module-6 deploy, reprised fast)
// while the Input row stays pixel-identical. Then the MCP identity appears
// above the entry: a tool name on a server URL, with the live dot. The
// world undims and holds on the deployed state.
// Beat intent: deploying onto an MCP server gives the same chain a tool
// name and an address other agents can discover.
export const DeployAsAToolScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const dimIn = interpolate(t, [0.5, 1.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dimOut = interpolate(t, [4.6, 5.3], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dimAmt = dimIn * dimOut;

	const ringOn = t >= 1.2 && t < 2.8;
	const morph = interpolate(t, [1.5, 2.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const pillReveal = interpolate(t, [3.1, 3.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<EconomyRig
				entryMix={morph}
				entry={{highlighted: ringOn}}
				agent={{dim: dimAmt}}
				response={{dim: dimAmt}}
				edge1={{opacity: 1 - 0.45 * dimAmt}}
				edge2={{opacity: 1 - 0.45 * dimAmt}}
				pill={{reveal: pillReveal}}
			/>
		</AbsoluteFill>
	);
};
