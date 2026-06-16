import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {blockX, BLOCK_W, CENTER_X, CENTER_Y, CHAIN_EDGE_Y, CHAIN_Y, edgeX1} from "../layout";
import {AgentChain, CanvasDots, DataPill, WireDot} from "./_local";

// Scene 2 — the reasoning step. Lean in: the Messages row reads the Start
// value through <start.input>; the value rides in, the model thinks (live
// ring), a result rides out and Response reads it as <agent.score>.
export const TheReasoningStepScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera: identity → between Start and Agent → back.
	const p1x = (blockX(0) + blockX(1) + BLOCK_W) / 2;
	const py = CHAIN_Y + 100;
	const camT = [0.4, 1.6, 7.4, 8.6];
	const px = interpolate(t, camT, [CENTER_X, p1x, p1x, CENTER_X], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pyv = interpolate(t, camT, [CENTER_Y, py, py, CENTER_Y], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = interpolate(t, camT, [1, 1.45, 1.45, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const tx = CENTER_X - px * s;
	const ty = CENTER_Y - pyv * s;

	// The lead value dives into the Messages row (row 1 of the agent block).
	const MSG_ROW_Y = CHAIN_Y + 90;
	const pillT = interpolate(t, [2.0, 3.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pillX = interpolate(pillT, [0, 1], [edgeX1(0) + 6, blockX(1) + BLOCK_W / 2]);
	const dip = interpolate(pillT, [0.12, 0.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pillY = CHAIN_EDGE_Y + (MSG_ROW_Y - CHAIN_EDGE_Y) * dip;
	// Absorbed in the row's empty middle, gone before it can sit on the text.
	const pillOp =
		pillT <= 0 || pillT >= 0.82
			? 0
			: pillT < 0.1
				? pillT / 0.1
				: pillT > 0.58
					? Math.max(0, (0.82 - pillT) / 0.24)
					: 1;

	const glowMsg = interpolate(t, [2.9, 3.4, 6.6, 7.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const edge1Hi = interpolate(t, [2.0, 2.4, 3.3, 3.9], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Thinking, then the result dot rides out.
	const agentLive = t >= 3.3 && t < 5.4;
	const outT = interpolate(t, [5.4, 6.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const outX = interpolate(outT, [0, 1], [edgeX1(1) + 4, blockX(2) - 16]);
	const outOp = outT <= 0 || outT >= 1 ? 0 : outT < 0.2 ? outT / 0.2 : outT > 0.8 ? (1 - outT) / 0.2 : 1;
	const edge2Hi = interpolate(t, [5.4, 5.7, 6.4, 6.9], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const glowResp = interpolate(t, [6.2, 6.7, 7.6, 8.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translate(${tx}px, ${ty}px) scale(${s})`,
					transformOrigin: "0 0",
				}}
			>
				<AgentChain
					agent={{highlighted: agentLive}}
					edge1={{hi: edge1Hi}}
					edge2={{hi: edge2Hi}}
					tagGlowMsg={glowMsg}
					tagGlowResp={glowResp}
				/>
				{pillOp > 0 ? (
					<DataPill
						text="Acme Corp · 40 seats"
						x={pillX}
						y={pillY}
						opacity={pillOp}
						scale={1 - 0.4 * dip * pillT}
					/>
				) : null}
				{outOp > 0 ? <WireDot x={outX} y={CHAIN_EDGE_Y} opacity={outOp} /> : null}
			</div>
		</AbsoluteFill>
	);
};
