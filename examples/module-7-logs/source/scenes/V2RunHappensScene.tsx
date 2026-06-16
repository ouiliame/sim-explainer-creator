import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "../../../components";
import {runBeats4, TicketChain} from "./_v2";

// v2 scene 1 — a run happens. The real triage chain assembles (staggered
// fade + edges drawing on), then ONE run crosses it: the charged-twice
// message resolves into Start, the pulse walks the wires, Triage holds its
// live ring (where the real 12.2s went), BuildRow blips, LogTicket's Data
// resolves to the category and settles ok. Everything reverts: from out
// here, the run is already over.
// Exit contract (→ scene 2): chain center-framed, template values, no rings.
export const V2RunHappensScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Assemble: blocks staggered, edges draw between settled neighbors.
	const blockIn = (i: number) =>
		interpolate(t, [0.2 + i * 0.45, 0.8 + i * 0.45], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	const edgeIn = (i: number) =>
		interpolate(t, [0.9 + i * 0.45, 1.5 + i * 0.45], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The single traversal (run economy: this is THE run the record describes).
	const run = runBeats4(t, 3.6);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<TicketChain
				glide={0}
				start={{opacity: blockIn(0), highlighted: run.startLive}}
				triage={{opacity: blockIn(1), highlighted: run.triLive}}
				build={{opacity: blockIn(2), highlighted: run.buildLive}}
				ticket={{opacity: blockIn(3), state: run.ticketOk ? "ok" : "none"}}
				edges={[{progress: edgeIn(0)}, {progress: edgeIn(1)}, {progress: edgeIn(2)}]}
				pulses={[run.pulse1, run.pulse2, run.pulse3]}
				inputResolve={run.inputMix}
				msgResolve={run.msgMix}
				dataResolve={run.dataMix}
			/>
		</AbsoluteFill>
	);
};
