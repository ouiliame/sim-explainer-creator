import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse, popIn} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../layout";
import {
	chainSwap,
	clamp01 as c,
	EconomyRig,
	PathPulse,
	SLOT_CLAUDE_CODE,
	SLOT_CLAUDE_DESKTOP,
	SLOT_CURSOR,
	SLOT_SIM,
	SLOT_VSCODE,
	spokePath,
	type BadgeVis,
} from "./_rig";

// Scene 4 — the rush (the money shot). The other four clients pop in around
// Claude Desktop (the product's client picker, product order) and the calls
// come back to back: Cursor → Claude Code → VS Code → Sim, each badge
// lighting blue as its call goes out, the rows dip-swapping value to value
// as each run lands, the reply riding back and flashing the badge green —
// the cadence tightening so late calls are in flight while earlier replies
// are still returning. Then everything settles and reverts.
// Beat intent: you published once — now five different agents, on five
// different platforms, treat your workflow as infrastructure.

type RushRun = {slot: number; a: number; company: string; brief: string};

// Accelerating cadence: gaps 1.6 / 1.4 / 1.2.
const RUNS: RushRun[] = [
	{slot: SLOT_CURSOR, a: 3.2, company: "Helio Robotics", brief: '"warehouse robots"'},
	{slot: SLOT_CLAUDE_CODE, a: 4.8, company: "Quartzline", brief: '"data tooling"'},
	{slot: SLOT_VSCODE, a: 6.2, company: "Parcelio", brief: '"logistics API"'},
	{slot: SLOT_SIM, a: 7.4, company: "Lumora Grid", brief: '"energy AI"'},
];

const REVERT = 12.0;

// Per-run quick beats (compressed run grammar; rows chain-swap instead of
// reverting between runs — the row is continuously busy).
const land = (a: number) => a + 0.55;
const msgAt = (a: number) => a + 1.2;
const respAt = (a: number) => a + 2.3;

export const TheRushScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The four new badges pop in, spokes drawing right behind each.
	const pops: Record<number, number> = {
		[SLOT_CURSOR]: 0.5,
		[SLOT_CLAUDE_CODE]: 0.95,
		[SLOT_VSCODE]: 1.4,
		[SLOT_SIM]: 1.85,
	};

	const badges: Partial<Record<number, BadgeVis>> = {
		[SLOT_CLAUDE_DESKTOP]: {reveal: 1},
	};
	const spokes: Partial<Record<number, {progress: number}>> = {
		[SLOT_CLAUDE_DESKTOP]: {progress: 1},
	};
	for (const [slotStr, pop] of Object.entries(pops)) {
		const slot = Number(slotStr);
		badges[slot] = {reveal: popIn(frame, fps, pop)};
		spokes[slot] = {
			progress: interpolate(t, [pop + 0.35, pop + 0.95], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: EASING.out,
			}),
		};
	}

	// Run state unions + per-badge rings.
	let startBlip = false;
	let midLive = false;
	let respBlip = false;
	for (const r of RUNS) {
		startBlip ||= t >= r.a + 0.5 && t < r.a + 0.85;
		midLive ||= t >= r.a + 1.25 && t < r.a + 1.75;
		respBlip ||= t >= r.a + 2.25 && t < r.a + 2.7;
		badges[r.slot] = {
			...badges[r.slot],
			blue: Math.min(c(t, r.a - 0.25, r.a), c(t, r.a + 2.5, r.a + 2.8, 1, 0)),
			green: Math.min(c(t, r.a + 3.0, r.a + 3.25), c(t, r.a + 3.7, r.a + 4.3, 1, 0)),
		};
	}

	// Rows: first landing resolves template → value; later landings dip-swap
	// value → value; one revert at the end of the rush.
	const out = c(t, REVERT, REVERT + 0.35, 1, 0);
	const inputMix = Math.min(c(t, land(RUNS[0].a), land(RUNS[0].a) + 0.35), out);
	const msgMix = Math.min(c(t, msgAt(RUNS[0].a), msgAt(RUNS[0].a) + 0.35), out);
	const respMix = Math.min(c(t, respAt(RUNS[0].a), respAt(RUNS[0].a) + 0.35), out);

	const inputText = chainSwap(
		t,
		RUNS[0].company,
		RUNS.slice(1).map((r) => ({at: land(r.a), value: r.company})),
	);
	const msgText = chainSwap(
		t,
		RUNS[0].company,
		RUNS.slice(1).map((r) => ({at: msgAt(r.a), value: r.company})),
	);
	const respText = chainSwap(
		t,
		RUNS[0].brief,
		RUNS.slice(1).map((r) => ({at: respAt(r.a), value: r.brief})),
	);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<EconomyRig
				entryMix={1}
				entry={{highlighted: startBlip}}
				agent={{highlighted: midLive}}
				response={{highlighted: respBlip}}
				pill={{reveal: 1}}
				showInHandle
				badges={badges}
				spokes={spokes}
				inputResolve={{text: inputText, mix: inputMix}}
				msgResolve={{text: msgText, mix: msgMix}}
				respResolve={{text: respText, mix: respMix}}
			/>
			{RUNS.map((r) => {
				const spoke = spokePath(r.slot);
				return (
					<React.Fragment key={r.slot}>
						<PathPulse d={spoke.d} len={spoke.len} p={c(t, r.a, r.a + 0.6)} />
						<PathPulse
							d={spoke.d}
							len={spoke.len}
							p={c(t, r.a + 2.5, r.a + 3.1)}
							reverse
						/>
					</React.Fragment>
				);
			})}
			{RUNS.map((r) => (
				<React.Fragment key={`chain-${r.slot}`}>
					<WirePulse
						x1={edgeX1(0)}
						x2={edgeX2(0)}
						y={CHAIN_EDGE_Y}
						p={c(t, r.a + 0.7, r.a + 1.25)}
						len={55}
					/>
					<WirePulse
						x1={edgeX1(1)}
						x2={edgeX2(1)}
						y={CHAIN_EDGE_Y}
						p={c(t, r.a + 1.75, r.a + 2.3)}
						len={55}
					/>
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};
