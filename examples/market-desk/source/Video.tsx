import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheBoardScene} from "./scenes/TheBoardScene";
import {DeskTakesShapeScene} from "./scenes/DeskTakesShapeScene";
import {WiredByReferenceScene} from "./scenes/WiredByReferenceScene";
import {ArmedScene} from "./scenes/ArmedScene";
import {ThePullScene} from "./scenes/ThePullScene";
import {TheFanScene} from "./scenes/TheFanScene";
import {OneAnalystScene} from "./scenes/OneAnalystScene";
import {TheSignalsScene} from "./scenes/TheSignalsScene";
import {DeskAtRestScene} from "./scenes/DeskAtRestScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// market-desk v1 (script-v1.md) — the prediction-market desk, honest
// version: a table holds the watchlist (market + odds), a schedule fires
// every hour, Polymarket's real block pulls the markets, and a Parallel
// container fans one analyst lane (Agent → Table upsert) into five
// concurrent analysts. ONE run spans scenes 5→8 through three
// freeze-cuts (container live → fan live + tag resolved → lane done +
// row priced); the money shot is the est/edge/signal columns filling in
// scramble order while the mispriced markets flag themselves.
// Authored durations are the visual minimums; vo-sync re-times each
// scene to its narration (extend-only).
const BASE_SCENES: SceneDef[] = [
	{name: "the-board", durationSec: 8, Component: TheBoardScene},
	{name: "the-desk-takes-shape", durationSec: 12, Component: DeskTakesShapeScene},
	{name: "wired-by-reference", durationSec: 7, Component: WiredByReferenceScene},
	{name: "armed", durationSec: 5, Component: ArmedScene},
	{name: "the-pull", durationSec: 9, Component: ThePullScene},
	{name: "the-fan", durationSec: 8, Component: TheFanScene},
	{name: "one-analyst", durationSec: 12, Component: OneAnalystScene},
	{name: "the-signals", durationSec: 10, Component: TheSignalsScene},
	{name: "the-desk-at-rest", durationSec: 10, Component: DeskAtRestScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const MarketDeskVideo: React.FC = () => {
	let cursor = 0;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, color: COLORS.text}}>
			{SCENES.map((scene) => {
				const from = cursor;
				const durationInFrames = seconds(scene.durationSec);
				cursor += durationInFrames;
				const Scene = scene.Component;
				return (
					<Sequence
						key={scene.name}
						from={from}
						durationInFrames={durationInFrames}
						layout="none"
						name={scene.name}
					>
						<Scene />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
