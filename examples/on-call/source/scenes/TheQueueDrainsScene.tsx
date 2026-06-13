import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_ALL} from "../layout";
import {CADENCE_ORDER, FOLLOWED_ROW} from "../data";
import {FLIP_DONE, FLIP_NONE, flipAt, ramp, type Flip} from "./_beats";
import {Stage} from "./_rig";

// Scene 6 — the queue drains. [cadence, runs 2–6] Steady CAM_ALL. The
// remaining five alerts arrive in accelerating cadence: for each, the
// webhook blips, a pulse crosses, the agent ring pulses live → ok (chips
// ringing in quick rhythm), the three terminals blip ok — and a DIFFERENT
// table row flips firing → triaged → assigned (scramble order 5, 1, 6, 2,
// 4), each with the green tint decaying to residue. The record stays run
// 1's settled record.
// Beat intent: every alert gets the same treatment — the queue drains
// itself, row after row.

// Accelerating cadence (no overlap; each run is one blip-traversal).
const STARTS = [1.0, 4.6, 7.6, 10.0, 11.9];
const DURS = [3.2, 2.7, 2.2, 1.8, 1.6];

export const TheQueueDrainsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Per-run phase 0..1 (clamped); runs never overlap so max() composes.
	const u = (k: number) => (t - STARTS[k]) / DURS[k];
	const within = (k: number, a: number, b: number) => u(k) >= a && u(k) < b;
	const anyRun = (a: number, b: number) => STARTS.some((_, k) => within(k, a, b));
	const maxRun = (f: (k: number) => number) => Math.max(...STARTS.map((_, k) => f(k)));

	// The traversal: webhook blip → pulse → agent live (chips in quick
	// rhythm) → fan pulses → the three terminals blip — same shape as run 1,
	// compressed.
	const webhookLive = anyRun(0, 0.14);
	const agentLive = anyRun(0.28, 0.6);
	const termsLive = anyRun(0.76, 0.9);
	const p1 = maxRun((k) => ramp(u(k), 0.06, 0.32));
	const fanP = maxRun((k) => ramp(u(k), 0.6, 0.78));
	const ring = (i: number) =>
		maxRun((k) => {
			const c = STARTS[k] + (0.34 + 0.075 * i) * DURS[k];
			return Math.min(ramp(t, c - 0.12, c), ramp(t, c + 0.1, c + 0.3, 1, 0));
		});

	// Each run flips ITS row: triaged when the agent settles, assigned when
	// the page lands. Row 3 stays run 1's settled flip.
	const flipFor = (r: number): Flip => {
		if (r === FOLLOWED_ROW) return FLIP_DONE;
		const k = CADENCE_ORDER.indexOf(r);
		if (k === -1) return FLIP_NONE;
		return flipAt(t, STARTS[k] + 0.6 * DURS[k], STARTS[k] + 0.9 * DURS[k]);
	};

	return (
		<Stage
			cam={CAM_ALL}
			webhook={{highlighted: webhookLive, state: webhookLive ? "none" : "ok"}}
			agent={{highlighted: agentLive, state: agentLive ? "none" : "ok"}}
			terms={[
				{highlighted: termsLive, state: termsLive ? "none" : "ok"},
				{highlighted: termsLive, state: termsLive ? "none" : "ok"},
				{highlighted: termsLive, state: termsLive ? "none" : "ok"},
			]}
			toolRings={[ring(0), ring(1), ring(2)]}
			pulse1={p1}
			fanPulses={[fanP, fanP, fanP]}
			statusAt={(r) => flipFor(r).status}
			statusTextOp={(r) => flipFor(r).textOp}
			statusTint={(r) => flipFor(r).tint}
			recordIn={1}
			logReveals={[1, 1, 1, 1, 1]}
			logSelected={1}
		/>
	);
};
