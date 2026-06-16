import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {AgentGlyphW, OutputBundle, popIn, SlackGlyphW, StartGlyphW} from "../../../components";
import {CanvasDots} from "./_local";
import {CHIP_CRM, CHIP_DOCS, CHIP_SEARCH_V3, TriageChain} from "./_v3";

// v3 scene 5 — the run record. Everything the run did is written down: the
// logs, the agent's content, tokens, and the toolCalls array. Every value
// here is from the real beaming-polaris run (see demo-corpus/triage-run.md);
// the Slack duration stands in (the live run's terminal write) until the
// Slack-wired re-run.
export const TheRunRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The chain recedes behind the record.
	const dim = interpolate(t, [0.4, 1.1, 6.6, 7.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const panelOp = interpolate(t, [0.9, 1.7, 6.6, 7.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const PANEL_SCALE = 1.7;
	// Spring-driven rise (organic overshoot), opacity handles the exit.
	const panelRise = popIn(frame, fps, 0.9, 0.8);
	const panelY = 200 + (1 - panelRise) * 30;

	const reveal = (t0: number) =>
		interpolate(t, [t0, t0 + 0.4], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The toolCalls node is the point of the scene.
	const toolCallsHi = interpolate(t, [3.6, 4.2, 6.0, 6.6], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TriageChain
				morph={1}
				start={{dim}}
				mid={{dim}}
				response={{dim}}
				edge1={{opacity: 1 - 0.75 * dim}}
				edge2={{opacity: 1 - 0.75 * dim}}
				gifts={{tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3]}}
			/>

			{panelOp > 0 ? (
				<div style={{position: "absolute", left: (1920 - 640 * PANEL_SCALE) / 2, top: panelY}}>
					<OutputBundle
						scale={PANEL_SCALE}
						opacity={panelOp}
						logs={[
							{
								name: "Start",
								color: "#2FB3FF",
								glyph: <StartGlyphW size={11} />,
								duration: "32ms",
								reveal: reveal(1.7),
							},
							{
								name: "Triage",
								color: "#33C482",
								glyph: <AgentGlyphW size={11} />,
								duration: "12.2s",
								selected: true,
								reveal: reveal(1.9),
							},
							{
								name: "Slack",
								color: "#611f69",
								glyph: <SlackGlyphW size={10} />,
								duration: "111ms",
								reveal: reveal(2.1),
							},
						]}
						values={[
							{
								key: "content",
								type: "string",
								value: "billing — Alex Johnson charged twice…",
								reveal: reveal(2.3),
							},
							{
								key: "tokens",
								type: "object",
								children: [
									{key: "input", type: "number", value: "5074"},
									{key: "output", type: "number", value: "431"},
								],
								reveal: reveal(2.6),
							},
							{
								key: "toolCalls",
								type: "array",
								highlight: toolCallsHi,
								children: [
									{key: "[0] customerLookup", type: "object", value: "375ms · 1 account"},
									{key: "[1] knowledge_search", type: "object", value: "457ms · 0 results"},
									{key: "[2] knowledge_search", type: "object", value: "540ms · 0 results"},
								],
								reveal: reveal(2.9),
							},
						]}
					/>
				</div>
			) : null}

		</AbsoluteFill>
	);
};
