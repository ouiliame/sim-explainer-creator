import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, KbChain, KbPanel, QUESTION} from "./_shared";

// v2 scene 2 — the knowledge base. We are inside the held moment (question
// resolved, Knowledge live ring on). The rest of the chain dims and the
// base itself rises above it: the Knowledge Base row glows while the panel
// appears (the link is carried by synchrony, never a connector line), then
// its documents fade in — four of the seventeen.
export const TheKnowledgeBaseScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const aside = interpolate(t, [0.3, 1.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const panel = interpolate(t, [0.6, 1.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// The block's Knowledge Base row ↔ the panel: same moment, same name.
	const kbRowGlow = interpolate(t, [1.6, 2.0, 7.3, 7.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const docReveal = (i: number) =>
		interpolate(t, [2.2 + i * 0.5, 2.65 + i * 0.5], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{dim: aside}}
				knowledge={{highlighted: true}}
				agent={{dim: aside}}
				edge1={{opacity: 1 - 0.75 * aside}}
				edge2={{opacity: 1 - 0.75 * aside}}
				inputResolve={{text: QUESTION, mix: 1}}
				kbRowGlow={kbRowGlow}
			/>
			{panel > 0 ? (
				<KbPanel opacity={panel} slide={panel} docSlide={0} docReveal={docReveal} />
			) : null}
		</AbsoluteFill>
	);
};
