import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {popIn, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {cv, Rig, wave} from "./_rig";

// Scene 3 — the run begins [run, freeze-cut out]. Start blips; the input
// is read; the pulse crosses; Research goes LIVE — and its first move is
// to go out: the Exa chip rings and, in sync, evidence card 1 drops into
// rail slot 1 (search results, skeleton rows). The live ring HOLDS through
// the cut: this run spans four scenes.
export const TheRunBeginsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The run.
	const startBlip = t >= 0.4 && t < 0.95;
	const inputGlow = wave(t, 0.4, 1.5);
	const pulse1 = cv(t, 1.0, 1.7);
	const agentLive = t >= 1.6; // holds through the boundary
	const msgGlow = wave(t, 2.0, 3.6);

	// First tool call: chip ring and card birth are ONE event on two
	// surfaces (the ResolvedTag synchrony discipline).
	const exaRing = Math.min(cv(t, 4.4, 4.7), cv(t, 6.6, 7.0, 1, 0));
	const card1 = {
		reveal: popIn(frame, fps, 5.0, 0.7),
		body: cv(t, 5.2, 6.9),
		pulse: Math.min(cv(t, 5.8, 6.1), cv(t, 7.0, 7.5, 1, 0)),
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Rig
				start={{highlighted: startBlip}}
				agent={{highlighted: agentLive}}
				toolsReveal={1}
				inputGlow={inputGlow}
				msgGlow={msgGlow}
				chips={{exa: {ring: exaRing}}}
				cards={[card1, {}, {}, {}]}
			/>
			{pulse1 > 0 && pulse1 < 1 ? (
				<WirePulse
					x1={edgeX1(0)}
					x2={edgeX2(0)}
					y={CHAIN_EDGE_Y}
					p={EASING.inOut(pulse1)}
				/>
			) : null}
		</AbsoluteFill>
	);
};
