import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ChatPanel, DatabaseGlyphW, popIn, ResolvedTag, WirePulse} from "../../../components";
import {ToolGlyph} from "../../../components/ObjectIcons";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, TriageChain} from "./_v3";

// v3 scene 3 — THE centerpiece. We enter inside the moment scene 2 froze:
// the run is mid-flight, the block is thinking. What "thinking" is: the
// block has spawned a fresh chat — your Messages param became the chat's
// messages (<start.message> resolves in the row and the bubble TOGETHER),
// tools sit on the table and get called inside that chat (chips ring in
// sync), and the reply comes back. Then the SAME run completes outward:
// pulse to Slack, the agent's words resolve into the Message row.
// VO anchor: "like spawning a new chat with ChatGPT or Claude, right
// inside your workflow."
export const InsideTheAgentScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const PANEL = {x: 1235, y: 395, w: 580};

	// The aside opens out of the held moment and closes before the run ends.
	const aside = interpolate(t, [0.6, 1.5, 16.0, 17.0], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Carried in from scene 2's freeze; everything reverts together at the end.
	const revertOut = interpolate(t, [21.0, 21.4], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const inputMix = Math.min(1, revertOut);

	// The mapping is carried by synchrony alone: the Messages row glows and
	// the bubble appears with the same content — no connector line.
	const rowGlow = interpolate(t, [1.7, 2.1, 5.4, 5.9], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const msgReveal = interpolate(t, [2.5, 3.2], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	// The money beat, with room to land: the tag becomes the actual message
	// in the block row and the chat bubble SIMULTANEOUSLY.
	const tagResolve = interpolate(t, [4.5, 5.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const blockTagResolve = Math.min(tagResolve, revertOut);

	const thinking = interpolate(t, [5.8, 6.2, 6.6, 6.9], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	// Tool call 1: customerLookup (real: 375ms → the ZenGraph account).
	const tool1Reveal = interpolate(t, [7.0, 7.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const tool1Done = interpolate(t, [8.5, 8.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const crmRing = interpolate(t, [7.0, 7.3, 8.5, 8.9], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const result1Reveal = interpolate(t, [8.9, 9.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	// Tool call 2: knowledge_search (real: 0 results — swap after the seeded re-run).
	const tool2Reveal = interpolate(t, [10.3, 10.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const tool2Done = interpolate(t, [11.8, 12.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const docsRing = interpolate(t, [10.3, 10.6, 11.8, 12.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const result2Reveal = interpolate(t, [12.2, 12.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const replyReveal = interpolate(t, [13.4, 14.1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Live from the first frame (carried in from scene 2's freeze); the ring
	// releases as the panel closes — the thinking is done.
	const agentLive = t < 16.2;

	// The SAME run completes outward.
	const outPulse = interpolate(t, [17.2, 18.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const respMix = Math.min(
		interpolate(t, [18.0, 18.35], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
		revertOut,
	);
	const respBlip = t >= 17.9 && t < 18.6;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{dim: aside}}
				mid={{highlighted: agentLive}}
				response={{dim: aside, highlighted: respBlip}}
				edge1={{opacity: 1 - 0.75 * aside}}
				edge2={{opacity: 1 - 0.75 * aside}}
				tagGlowMsg={rowGlow}
				inputResolve={{text: "I was charged twice", mix: inputMix}}
				msgResolve={{text: "I was charged twice", mix: blockTagResolve}}
				respResolve={{text: "billing — double charge", mix: respMix}}
				gifts={{
					tools: [
						{...CHIP_DOCS, ring: docsRing},
						{...CHIP_CRM, ring: crmRing},
						CHIP_SEARCH_V3,
					],
				}}
			/>

			{aside > 0 ? (
				<ChatPanel
					x={PANEL.x}
					y={PANEL.y}
					w={PANEL.w}
					opacity={aside}
					slide={Math.min(popIn(frame, fps, 0.6, 0.9), aside)}
					phase={t * 0.9}
					items={[
						{
							kind: "user",
							reveal: msgReveal,
							content: (
								<>
									{"Classify and summarize: "}
									<ResolvedTag
										tag="<start.message>"
										value="I was charged twice for the Pro plan…"
										glow={0.6}
										resolve={tagResolve}
									/>
								</>
							),
						},
						{kind: "thinking", reveal: thinking},
						{
							kind: "tool",
							reveal: tool1Reveal,
							name: "customerLookup",
							color: "#6366F1",
							glyph: <ToolGlyph size={16} color="#ffffff" />,
							detail: "alex.johnson@zengraph…",
							done: tool1Done,
						},
						{
							kind: "result",
							reveal: result1Reveal,
							text: "ZenGraph 3282 · Alex Johnson · active · $2M deal",
						},
						{
							kind: "tool",
							reveal: tool2Reveal,
							name: "Knowledge",
							color: "#00B0B0",
							glyph: <DatabaseGlyphW size={16} />,
							detail: "refund policy",
							done: tool2Done,
						},
						{kind: "result", reveal: result2Reveal, text: "0 results"},
						{
							kind: "assistant",
							reveal: replyReveal,
							content: "billing — double charge; escalate, loop in Jessica Liu",
						},
					]}
				/>
			) : null}

			<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={outPulse} />

		</AbsoluteFill>
	);
};
