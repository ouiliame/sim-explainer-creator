import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {AgentGlyphW, DatabaseGlyphW, OutputBundle, StartGlyphW} from "../../../components";
import {RECORD_SCALE, RECORD_X, RECORD_Y} from "../layoutV2";
import {CanvasDots, KbChain, QUESTION} from "./_shared";

// v2 scene 6 — the search record. The chain recedes and the run inspector
// rises with the Knowledge step selected: the docs' own authored output for
// this exact workflow (using-in-workflows.mdx) — results / query /
// totalResults, with content and documentName from the demo corpus so the
// video stays one world. The results key is the point of the scene.
export const TheSearchRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const dim = interpolate(t, [0.4, 1.1, 7.6, 8.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const panelOp = interpolate(t, [0.9, 1.7, 7.6, 8.4], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const panelY = RECORD_Y + (1 - Math.min(1, panelOp)) * 30;

	const reveal = (t0: number) =>
		interpolate(t, [t0, t0 + 0.4], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The results array is what a later block reads (<knowledge.results>).
	const resultsHi = interpolate(t, [3.4, 4.0, 6.4, 7.0], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<KbChain
				start={{dim}}
				knowledge={{dim}}
				agent={{dim}}
				edge1={{opacity: 1 - 0.75 * dim}}
				edge2={{opacity: 1 - 0.75 * dim}}
			/>

			{panelOp > 0 ? (
				<div style={{position: "absolute", left: RECORD_X, top: panelY}}>
					<OutputBundle
						scale={RECORD_SCALE}
						opacity={panelOp}
						logs={[
							{
								name: "Start",
								color: "#2FB3FF",
								glyph: <StartGlyphW size={11} />,
								duration: "9ms",
								reveal: reveal(1.7),
							},
							{
								name: "Knowledge",
								color: "#00B0B0",
								glyph: <DatabaseGlyphW size={11} />,
								duration: "312ms",
								selected: true,
								reveal: reveal(1.9),
							},
							{
								name: "Agent",
								color: "#33C482",
								glyph: <AgentGlyphW size={11} />,
								duration: "1.2s",
								reveal: reveal(2.1),
							},
						]}
						values={[
							{
								key: "results",
								type: "array",
								highlight: resultsHi,
								reveal: reveal(2.4),
								children: [
									{
										key: "0",
										type: "object",
										children: [
											{
												key: "content",
												type: "string",
												value: '"Annual plans are eligible for a full refund…"',
											},
											{key: "documentName", type: "string", value: '"refund-policy.md"'},
											{key: "similarity", type: "number", value: "0.92"},
											{key: "sourceUrl", type: "null"},
										],
									},
								],
							},
							{key: "query", type: "string", value: `"${QUESTION}"`, reveal: reveal(2.8)},
							{key: "totalResults", type: "number", value: "5", reveal: reveal(3.0)},
						]}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
