import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {Stage} from "./_rig";
import {S3_CALLS_CONNECT} from "./states";
import {mkClock, sceneClock} from "./_anim";

// Scene 3 — calls-connect [asides are born]. Enters on S2 (run live, fan
// out, home cam). Below the workflow, in their own band, three call panels
// pop in staggered — one per connected call: masked destination, pulsing
// live dot, the registry greeting bubble rising in, waveform springing to
// life, each de-phased. At the right the outcomes record appears: the real
// SimTable, header only, empty. The workflow above stays clean and live.
// Exits at S3.
export const CallsConnectScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {c} = mkClock(frame);
	const {gf, q} = sceneClock("calls-connect", frame);

	// Staggered births: pop in → greeting types in → the voice starts.
	const BIRTH = [0.5, 1.4, 2.3] as const;
	// Settle amplitudes carried into S3 (de-phased liveness).
	const SP = [1, 0.85, 0.7] as const;
	const panel = (i: 0 | 1 | 2) => ({
		visible: c(BIRTH[i], BIRTH[i] + 0.6, 0, 1, EASING.out),
		turnCount: 1,
		lastReveal: c(BIRTH[i] + 0.5, BIRTH[i] + 1.1, 0, 1, EASING.out),
		speaking: c(BIRTH[i] + 0.7, BIRTH[i] + 1.5, 0, SP[i], EASING.out),
	});

	// The record waiting to be filled: the real SimTable, header row only.
	const tableReveal = c(4.6, 5.4, 0, 1, EASING.out);

	return (
		<Stage
			frame={gf}
			state={{
				...S3_CALLS_CONNECT,
				panels: [panel(0), panel(1), panel(2)],
				tableReveal,
				quiet: q,
			}}
		/>
	);
};
