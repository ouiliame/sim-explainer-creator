import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {CAM_HOME} from "../layout";
import {Stage} from "./_rig";
import {mkClock, sceneClock} from "./_anim";

// Scene 6 — outcomes-land [accumulation, two surfaces one event]. Enters
// on S5 (all three live, 0 rows). Calls resolve staggered 1→2→3: a panel's
// waveform flatlines, its live dot goes solid green, a green ✓ outcome
// stamp lands — and IN SYNC a pulse crosses the lane edge, the Log outcome
// block blips, and a row drops into the SimTable. Three rows accumulate.
// Then the run settles: rings release, wires cool, the fan retracts to the
// single lane — complete before the cut. Exits at S7's enter state.
export const OutcomesLandScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {t, c} = mkClock(frame);
	const {gf, q} = sceneClock("outcomes-land", frame);

	// ── Call 1 resolves (~1.5s): flatline → solid dot → stamp + row.
	const sp0 = 1 - c(0.8, 1.5, 0, 1, EASING.inOut);
	const ended0 = t >= 1.6;
	const out0 = c(1.7, 2.4, 0, 1, EASING.out);
	const row0 = c(1.8, 2.5, 0, 1, EASING.out);

	// ── Call 2: says its authored confirmation line first, then resolves.
	const count1 = t < 2.6 ? 2 : 3;
	const turn3b = t < 2.6 ? 1 : c(2.6, 3.4, 0, 1, EASING.out);
	const sp1 = c(2.3, 2.9, 0, 1, EASING.inOut) - c(4.3, 4.9, 0, 1, EASING.inOut);
	const ended1 = t >= 5.0;
	const out1 = c(5.1, 5.8, 0, 1, EASING.out);
	const row1 = c(5.2, 5.9, 0, 1, EASING.out);

	// ── Call 3: still talking; its line lands, then it resolves last.
	const count2 = t < 5.6 ? 2 : 3;
	const turn3c = t < 5.6 ? 1 : c(5.6, 6.4, 0, 1, EASING.out);
	const sp2 = 0.9 - c(7.5, 8.1, 0, 0.9, EASING.inOut);
	const ended2 = t >= 8.2;
	const out2 = c(8.3, 9.0, 0, 1, EASING.out);
	const row2 = c(8.4, 9.1, 0, 1, EASING.out);

	// Two surfaces, one event: each landing = lane pulse + Log blip + row.
	// The pulse windows never overlap, so the lane carries one at a time.
	const pl1 = c(1.2, 1.8, 0, 1, EASING.inOut);
	const pl2 = c(4.6, 5.2, 0, 1, EASING.inOut);
	const pl3 = c(7.8, 8.4, 0, 1, EASING.inOut);
	const pulseLane = pl1 < 1 ? pl1 : pl2 < 1 ? pl2 : pl3;
	const logBlip = (t >= 1.7 && t < 2.3) || (t >= 5.1 && t < 5.7) || (t >= 8.3 && t < 8.9);

	// ── Settle: rings release staggered, wires cool, the fan retracts.
	const wireCool = c(9.6, 10.4, 1, 0, EASING.inOut);
	const fan = c(10.0, 11.4, 1, 0, EASING.inOut);

	return (
		<Stage
			frame={gf}
			state={{
				cam: CAM_HOME,
				campaign: {highlighted: t < 9.7},
				container: {highlighted: t < 10.0},
				call: {highlighted: t < 9.85},
				log: {highlighted: logBlip},
				edge1: {hi: wireCool},
				edge2: {hi: wireCool},
				pillE: {hi: wireCool},
				fan,
				pulseLane,
				panels: [
					{visible: 1, turnCount: 3, speaking: sp0, ended: ended0, outcomeReveal: out0},
					{
						visible: 1,
						turnCount: count1,
						lastReveal: turn3b,
						speaking: sp1,
						ended: ended1,
						outcomeReveal: out1,
					},
					{
						visible: 1,
						turnCount: count2,
						lastReveal: turn3c,
						speaking: sp2,
						ended: ended2,
						outcomeReveal: out2,
					},
				],
				tableReveal: 1,
				rowReveal: [row0, row1, row2],
				quiet: q,
			}}
		/>
	);
};
