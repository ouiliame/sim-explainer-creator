import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../../../theme";
import {CanvasDots, OutputBundle} from "../../../components";
import {PANEL_MIN_BODY_H, PANEL_SCALE, PANEL_X, PANEL_Y} from "../layout-v2";
import {buildLogRows, TicketChain, triageTree} from "./_v2";

// v2 scene 3 — what it really did. The run looked instant from outside; the
// record kept everything. The toolCalls array is the focal node: each call
// row highlights in turn while the matching tool chip on the Triage block
// above rings AT THE SAME MOMENT (synchrony only — no connector lines):
// customerLookup ↔ CRM, the two knowledge_searches ↔ Docs. Tokens and cost
// get a closing beat of key-glow. Everything reverts before the cut.
// Enter/exit contract: identical to scene 2's exit (all highlights at zero).
export const V2WhatItReallyDidScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const window = (lo: number, hi: number) =>
		interpolate(t, [lo, lo + 0.4, hi - 0.4, hi], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// The array itself is focal for the whole middle of the scene.
	const toolCallsHi = window(0.8, 10.0);

	// The three calls, in their real order; chips ring in sync.
	const call0 = window(2.0, 4.2); // customerLookup ↔ CRM
	const call1 = window(4.6, 6.8); // knowledge_search ↔ Docs
	const call2 = window(7.2, 9.4); // knowledge_search ↔ Docs (iteration 2)

	// The closing beat: it also counted the work (tokens).
	const tokensHi = window(9.8, 11.5);

	// Triage leans out of the dim while its chips are ringing.
	const callActive = Math.max(call0, call1, call2);
	const triageDim = 1 - 0.7 * callActive;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TicketChain
				glide={1}
				start={{dim: 1}}
				triage={{dim: triageDim}}
				build={{dim: 1}}
				ticket={{dim: 1}}
				edges={[{opacity: 0.35}, {opacity: 0.35}, {opacity: 0.35}]}
				chipRings={{crm: call0, docs: Math.max(call1, call2)}}
			/>

			<div style={{position: "absolute", left: PANEL_X, top: PANEL_Y}}>
				<OutputBundle
					scale={PANEL_SCALE}
					opacity={1}
					minBodyH={PANEL_MIN_BODY_H}
					logs={buildLogRows({selected: [0, 1, 0, 0]})}
					values={triageTree({
						toolCallsHi,
						callHi: [call0, call1, call2],
						tokensHi,
					})}
				/>
			</div>
		</AbsoluteFill>
	);
};
