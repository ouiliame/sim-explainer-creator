import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BLOCK_COLORS, GmailGlyphFull, ResponseGlyphW, SimBlock, StartGlyphW} from "../../../components";
import {blockX, CHAIN_EDGE_Y, edgeX1, edgeX2, LANE_EDGE_Y, LANE_Y} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_SEARCH, LaneEdge, WireDot} from "./_local";

// Scene 4 — who decides. The same Gmail twice: above as a BLOCK on the path
// (it runs every time the path reaches it); below as an agent TOOL (it runs
// only when the agent chooses). Two runs through both lanes make the
// difference visible without a word.
export const WhoDecidesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const laneOp = interpolate(t, [0.5, 1.4, 8.8, 9.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const dot = (from: number, to: number, i: 0 | 1, y: number) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		const x = interpolate(p, [0, 1], [edgeX1(i) + 4, edgeX2(i) - 4]);
		const op = p <= 0 || p >= 1 ? 0 : p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
		return {x, y, op};
	};

	const ringWindow = (from: number, to: number) =>
		interpolate(t, [from, from + 0.25, to, to + 0.35], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// Run A (both lanes): block lane Gmail lights; agent chooses Send Email too.
	// Run B: block lane Gmail lights AGAIN; the agent skips it.
	const laneDots = [
		dot(1.9, 2.6, 0, LANE_EDGE_Y),
		dot(3.5, 4.2, 1, LANE_EDGE_Y),
		dot(5.6, 6.3, 0, LANE_EDGE_Y),
		dot(7.2, 7.9, 1, LANE_EDGE_Y),
	];
	const chainDots = [
		dot(1.9, 2.7, 0, CHAIN_EDGE_Y),
		dot(3.6, 4.4, 1, CHAIN_EDGE_Y),
		dot(5.6, 6.4, 0, CHAIN_EDGE_Y),
		dot(7.0, 7.8, 1, CHAIN_EDGE_Y),
	];

	const gmailBlockRingA = ringWindow(2.6, 3.4);
	const gmailBlockRingB = ringWindow(6.3, 7.1);
	const gmailBlockRinging = gmailBlockRingA > 0.5 || gmailBlockRingB > 0.5;
	const emailChipRing = ringWindow(2.8, 3.5); // run A only

	const agentLiveA = t >= 2.7 && t < 3.6;
	const agentLiveB = t >= 6.4 && t < 7.0;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />

			{/* Block lane (the path decides) */}
			<div style={{position: "absolute", inset: 0, opacity: laneOp}}>
				<LaneEdge i={0} y={LANE_EDGE_Y} />
				<LaneEdge i={1} y={LANE_EDGE_Y} />
				<div style={{position: "absolute", left: blockX(0), top: LANE_Y}}>
					<SimBlock
						name="Start"
						color={BLOCK_COLORS.start}
						glyph={<StartGlyphW size={22} />}
						rows={[{title: "Input", value: "Lead"}]}
						hideTargetHandle
					/>
				</div>
				<div style={{position: "absolute", left: blockX(1), top: LANE_Y}}>
					<SimBlock
						name="Gmail"
						color={BLOCK_COLORS.gmail}
						glyph={<GmailGlyphFull size={24} />}
						rows={[{title: "Operation", value: "Send Email"}]}
						highlighted={gmailBlockRinging}
					/>
				</div>
				<div style={{position: "absolute", left: blockX(2), top: LANE_Y}}>
					<SimBlock
						name="Response"
						color={BLOCK_COLORS.response}
						glyph={<ResponseGlyphW size={21} />}
						rows={[{title: "Status", value: "200"}]}
						hideSourceHandle
					/>
				</div>
				{laneDots.map((d, i) => (d.op > 0 ? <WireDot key={i} x={d.x} y={d.y} opacity={d.op} /> : null))}
			</div>

			{/* The agent chain (the agent decides) */}
			<AgentChain
				agent={{highlighted: agentLiveA || agentLiveB}}
				gifts={{
					tools: [CHIP_SEARCH, {...CHIP_EMAIL, ring: emailChipRing}],
				}}
			/>
			{chainDots.map((d, i) => (d.op > 0 ? <WireDot key={i} x={d.x} y={d.y} opacity={d.op} /> : null))}
		</AbsoluteFill>
	);
};
