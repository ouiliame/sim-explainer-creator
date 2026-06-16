import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2, RAISE_DY} from "../layout";
import {ChildChain, InsidePanel, InsideStem, ParentChain} from "./_local";

// Scene 4 — inside the call (director's revision of the zoom-through).
// Opens INSIDE scene 3's held moment (the same frame). The parent chain
// glides UP and stays on screen the whole time — the Workflow block's live
// ring is the call, visibly halted at the top. Beneath it, the inside panel
// (container grammar, the block's indigo + the child's name in its header)
// expands down from the block on a solid stem: this panel IS that block's
// inside. The child runs end-to-end in the panel — the handed-off value IS
// its start.input — settles green, and HOLDS. The call above never moves.
// Beat intent: the run is waiting up there; down here is what it's waiting
// FOR.
export const InsideTheCallScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, easing?: (n: number) => number): number =>
		interpolate(t, [lo, hi], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	// The reveal: parent glides up; the panel + stem expand beneath it.
	const raise = c(0.7, 2.1, EASING.inOut);
	const expand = c(1.1, 2.5, EASING.out);

	// The child's run — the handoff first, then the familiar choreography.
	const inputMix = c(3.6, 4.0);
	const startBlip = t >= 3.9 && t < 4.4;
	const pulse1 = c(4.3, 4.95);
	const agentLive = t >= 4.9 && t < 5.7;
	const msgGlow = c(4.85, 5.1) * (1 - c(5.5, 5.8));
	const msgMix = c(5.1, 5.5);
	const pulse2 = c(5.7, 6.35);
	const respGlow = c(6.3, 6.55) * (1 - c(6.95, 7.25));
	const respMix = c(6.55, 6.95);
	const respBlip = t >= 6.5 && t < 7.0;

	// Done: settle green in causal order, and HOLD (the freeze-cut out).
	const startOk = t >= 7.6;
	const agentOk = t >= 8.0;
	const respOk = t >= 8.4;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			<InsideStem raise={raise} expand={expand} />
			<InsidePanel expand={expand}>
				<ChildChain
					start={{highlighted: startBlip, state: startOk ? "ok" : "none"}}
					agent={{highlighted: agentLive, state: agentOk ? "ok" : "none"}}
					response={{highlighted: respBlip, state: respOk ? "ok" : "none"}}
					edge1={{}}
					edge2={{}}
					inputMix={inputMix}
					msg={{glow: msgGlow, mix: msgMix}}
					resp={{glow: respGlow, mix: respMix}}
				/>
				<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
				<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
			</InsidePanel>

			{/* The halted call — never fades, never stops being live. */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translateY(${-RAISE_DY * raise}px)`,
				}}
			>
				<ParentChain
					start={{}}
					wf={{highlighted: true}}
					agent={{}}
					edge1={{}}
					edge2={{}}
					inputMix={1}
					iv={{mix: 1}}
				/>
			</div>
		</AbsoluteFill>
	);
};
