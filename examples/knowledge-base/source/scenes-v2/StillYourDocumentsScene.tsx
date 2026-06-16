import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WirePulse} from "../../../components";
import {CENTER_X, CENTER_Y, CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layoutV2";
import {CanvasDots, KbChain} from "./_shared";

// v2 scene 7 — still your documents. One final run walks the chain and
// everything settles green in causal order while the camera eases back.
// Hold the balanced frame for the closing VO.
export const StillYourDocumentsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const pulse1 = interpolate(t, [1.0, 1.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pulse2 = interpolate(t, [2.4, 3.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const startDone = t >= 1.0;
	const knowledgeLive = t >= 1.7 && t < 2.4;
	const knowledgeDone = t >= 2.4;
	const agentDone = t >= 3.2;

	const ease = interpolate(t, [2.6, 4.8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = 1 - 0.07 * ease;
	const tx = CENTER_X * (1 - s);
	const ty = CENTER_Y * (1 - s);

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
				<KbChain
					start={{state: startDone ? "ok" : "none"}}
					knowledge={{highlighted: knowledgeLive, state: knowledgeDone ? "ok" : "none"}}
					agent={{state: agentDone ? "ok" : "none"}}
				/>
				<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
			</div>
		</AbsoluteFill>
	);
};
