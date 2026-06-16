import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BLOCK_COLORS, SimBlock, SimEdgePath} from "../../../components";
import {WorkflowGlyph} from "../../../components/ObjectIcons";
import {
	blockX,
	CENTER_X,
	CENTER_Y,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	final5EdgeX1,
	final5EdgeX2,
	final5X,
	STAGE_H,
	STAGE_W,
	ZOOM9,
} from "../layout";
import {AgentChain, CanvasDots, CHIP_EMAIL, CHIP_KNOWLEDGE, CHIP_SEARCH, WireDot} from "./_local";

// Code glyph (function block): white chevrons, lucide `code` shape.
const CodeGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2.25"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m16 18 6-6-6-6" />
		<path d="m8 6-6 6 6 6" />
	</svg>
);

// Scene 9 — the full agent is still just a workflow. The camera pulls back;
// Enrich (a child workflow on the path) and Reshape (deterministic code)
// glide in between Start and the agent — the docs' lead scorer. One run walks
// the whole path; on the agent, exactly one tool chip is the agent's choice.
export const TheFullAgentScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera pulls back around stage center while blocks glide to their slots.
	const zoom = interpolate(t, [0.8, 2.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = 1 + (ZOOM9 - 1) * zoom;
	const tx = CENTER_X * (1 - s);
	const ty = CENTER_Y * (1 - s);

	const lerp = (a: number, b: number) => a + (b - a) * zoom;
	const xs = {
		start: lerp(blockX(0), final5X(0)),
		agent: lerp(blockX(1), final5X(3)),
		response: lerp(blockX(2), final5X(4)),
	};

	const insertOp = interpolate(t, [1.7, 2.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// The canonical edges fade out BEFORE the glide starts (so they never
	// detach from the moving handles); the final-layout edges draw after.
	const oldEdgesOp = interpolate(t, [0.3, 0.8], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const newEdge = (i: number) =>
		interpolate(t, [2.5 + i * 0.12, 3.0 + i * 0.12], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The run walks the path.
	const liveWindow = (from: number, to: number) => t >= from && t < to;
	const okAfter = (from: number) => t >= from;
	const runDot = (from: number, to: number, i: number) => {
		const p = interpolate(t, [from, to], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
		const x = interpolate(p, [0, 1], [final5EdgeX1(i) + 4, final5EdgeX2(i) - 4]);
		const op = p <= 0 || p >= 1 ? 0 : p < 0.2 ? p / 0.2 : p > 0.8 ? (1 - p) / 0.2 : 1;
		return {x, op};
	};
	const dots = [runDot(4.0, 4.7, 0), runDot(5.3, 6.0, 1), runDot(6.6, 7.3, 2), runDot(8.5, 9.2, 3)];

	const searchRing = interpolate(t, [7.7, 8.0, 8.4, 8.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const startState = okAfter(4.0) ? "ok" : "none";
	const enrichLive = liveWindow(4.7, 5.3);
	const enrichState = okAfter(5.3) ? "ok" : "none";
	const reshapeLive = liveWindow(6.0, 6.6);
	const reshapeState = okAfter(6.6) ? "ok" : "none";
	const agentLive = liveWindow(7.3, 8.5);
	const agentState = okAfter(8.5) ? "ok" : "none";
	const respState = okAfter(9.2) ? "ok" : "none";

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
				{/* Final-layout edges */}
				<svg
					width={STAGE_W}
					height={STAGE_H}
					viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
					style={{position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none"}}
				>
					{[0, 1, 2, 3].map((i) => (
						<SimEdgePath
							key={i}
							x1={final5EdgeX1(i)}
							y1={CHAIN_EDGE_Y}
							x2={final5EdgeX2(i)}
							y2={CHAIN_EDGE_Y}
							progress={newEdge(i)}
						/>
					))}
				</svg>

				<AgentChain
					xs={xs}
					start={{state: startState}}
					agent={{highlighted: agentLive, state: agentState}}
					response={{state: respState}}
					edge1={{opacity: oldEdgesOp}}
					edge2={{opacity: oldEdgesOp}}
					gifts={{
						tools: [
							{...CHIP_SEARCH, ring: searchRing},
							CHIP_EMAIL,
							CHIP_KNOWLEDGE,
						],
						skillsReveal: 1,
						memoryReveal: 1,
						rfReveal: 1,
					}}
				/>

				{/* Inserted path blocks: a child workflow and deterministic code */}
				<div style={{position: "absolute", left: final5X(1), top: CHAIN_Y, opacity: insertOp}}>
					<SimBlock
						name="Enrich"
						color={BLOCK_COLORS.workflow}
						glyph={<WorkflowGlyph size={22} color="#ffffff" />}
						rows={[{title: "Workflow", value: "enrich-lead"}]}
						highlighted={enrichLive}
						state={enrichState}
					/>
				</div>
				<div style={{position: "absolute", left: final5X(2), top: CHAIN_Y, opacity: insertOp}}>
					<SimBlock
						name="Reshape"
						color={BLOCK_COLORS.function}
						glyph={<CodeGlyphW size={22} />}
						rows={[{title: "Code", value: "return fields(<enrich.result>)"}]}
						highlighted={reshapeLive}
						state={reshapeState}
					/>
				</div>

				{dots.map((d, i) => (d.op > 0 ? <WireDot key={i} x={d.x} y={CHAIN_EDGE_Y} opacity={d.op} /> : null))}
			</div>
		</AbsoluteFill>
	);
};
