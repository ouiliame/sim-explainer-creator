import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ChatPanel, ResolvedTag} from "../../../components";
import {CHAT_PANEL} from "../layoutV2";
import {CanvasDots, KbChain, PASSAGE_FULL, PASSAGE_TRUNC, QUESTION} from "./_shared";

// v2 scene 5 — into the context. We open inside the moment scene 4 froze:
// the Agent's live ring is on. Its fresh chat slides in beside the dimmed
// chain (module-5's pattern), and the money beat lands: the Messages row's
// <knowledge.results> resolves to the retrieved passage in the block row
// and the chat bubble TOGETHER — the passages are IN the model's context
// before it answers. The reply is the document's own words. Panel closes,
// the ring releases, every resolution reverts.
export const IntoTheContextScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const aside = interpolate(t, [0.5, 1.4, 11.3, 12.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Carried in from scene 4's freeze; everything reverts together at the end.
	const revertOut = interpolate(t, [12.6, 13.1], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// The mapping is carried by synchrony alone: the Messages row glows while
	// the bubble appears with the same content — no connector line.
	const msgGlow = interpolate(t, [1.6, 2.0, 4.7, 5.2], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const bubbleReveal = interpolate(t, [2.2, 2.9], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	// The money beat: the tag becomes the retrieved passage in the block row
	// and the chat bubble SIMULTANEOUSLY.
	const tagResolve = interpolate(t, [3.8, 4.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const thinking = interpolate(t, [5.4, 5.8, 6.3, 6.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const replyReveal = interpolate(t, [6.9, 7.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Live since scene 4; the ring releases as the panel closes.
	const agentLive = t < 11.6;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{dim: aside}}
				knowledge={{dim: aside}}
				agent={{highlighted: agentLive}}
				edge1={{opacity: 1 - 0.75 * aside}}
				edge2={{opacity: 1 - 0.75 * aside}}
				inputResolve={{text: QUESTION, mix: revertOut}}
				queryResolve={{text: QUESTION, mix: revertOut}}
				msgGlow={msgGlow}
				msgResolve={{text: PASSAGE_TRUNC, mix: Math.min(tagResolve, revertOut)}}
			/>

			{aside > 0 ? (
				<ChatPanel
					x={CHAT_PANEL.x}
					y={CHAT_PANEL.y}
					w={CHAT_PANEL.w}
					opacity={aside}
					slide={aside}
					phase={t * 0.9}
					items={[
						{
							kind: "user",
							reveal: bubbleReveal,
							content: (
								// The docs' authored Messages line, verbatim.
								<>
									{"Answer from "}
									<ResolvedTag
										tag="<knowledge.results>"
										value={PASSAGE_TRUNC}
										glow={0.6}
										resolve={tagResolve}
									/>
								</>
							),
						},
						{kind: "thinking", reveal: thinking},
						{kind: "assistant", reveal: replyReveal, content: PASSAGE_FULL},
					]}
				/>
			) : null}
		</AbsoluteFill>
	);
};
