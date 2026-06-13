import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse, popIn} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {EconomyRig, mcpCall, PathPulse, SLOT_CLAUDE_DESKTOP, spokePath} from "./_rig";

// Scene 3 — a stranger calls. A client badge (Claude Desktop) pops in at
// the left edge and its spoke draws into the entry handle. Its ring goes
// blue, a pulse rides the spoke in, and the chain runs exactly as scene 1 —
// then the reply rides the SAME spoke back and the badge flashes green.
// Rows revert; the badge and spoke stay.
// Beat intent: an MCP client's tool call is just a workflow run — an agent
// you've never met now drives your agent.
export const AStrangerCallsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const badgeReveal = popIn(frame, fps, 0.7);
	const spokeDraw = interpolate(t, [1.5, 2.2], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const call = mcpCall(t, 3.4);
	const spoke = spokePath(SLOT_CLAUDE_DESKTOP);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<EconomyRig
				entryMix={1}
				entry={{highlighted: call.startBlip}}
				agent={{highlighted: call.midLive}}
				response={{highlighted: call.respBlip}}
				pill={{reveal: 1}}
				showInHandle={t >= 2.2}
				badges={{
					[SLOT_CLAUDE_DESKTOP]: {
						reveal: badgeReveal,
						blue: call.badgeBlue,
						green: call.badgeGreen,
					},
				}}
				spokes={{[SLOT_CLAUDE_DESKTOP]: {progress: spokeDraw}}}
				inputResolve={{text: "Northwind AI", mix: call.inputMix}}
				msgResolve={{text: "Northwind AI", mix: call.msgMix}}
				respResolve={{text: '"agent platform"', mix: call.respMix}}
			/>
			<PathPulse d={spoke.d} len={spoke.len} p={call.spokeIn} />
			<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={call.pulse1} len={55} />
			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={call.pulse2} len={55} />
			<PathPulse d={spoke.d} len={spoke.len} p={call.reply} reverse />
		</AbsoluteFill>
	);
};
