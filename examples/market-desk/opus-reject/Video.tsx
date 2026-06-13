import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheBoardScene} from "./scenes/TheBoardScene";
import {TheDeskTakesShapeScene} from "./scenes/TheDeskTakesShapeScene";
import {WiredByReferenceScene} from "./scenes/WiredByReferenceScene";
import {TheSweepScene} from "./scenes/TheSweepScene";
import {TheResearchFanScene} from "./scenes/TheResearchFanScene";
import {OneMarketScene} from "./scenes/OneMarketScene";
import {TheBoardLightsUpScene} from "./scenes/TheBoardLightsUpScene";
import {TheDeskScene} from "./scenes/TheDeskScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// market-desk v1 (script-v1.md) — the prediction-market desk: a board of live
// markets (SimTable) over a research workflow. Schedule fires → Polymarket
// pulls the markets → a Parallel container fans the research (an Analyst with
// Exa/Perplexity/Serper tools) → the agent's probability lands in the board's
// est column → edges resolve and mispriced rows flag SIGNAL. ONE run spans
// scenes 4→7 through three freeze-cuts (container live → fan live + tag
// resolved → followed row flipped). Authored durations are visual minimums;
// vo-sync re-times each scene to its narration (extend-only).
const BASE_SCENES: SceneDef[] = [
	{name: "the-board", durationSec: 9, Component: TheBoardScene},
	{name: "the-desk-takes-shape", durationSec: 13, Component: TheDeskTakesShapeScene},
	{name: "wired-by-reference", durationSec: 8, Component: WiredByReferenceScene},
	{name: "the-sweep", durationSec: 9, Component: TheSweepScene},
	{name: "the-research-fan", durationSec: 11, Component: TheResearchFanScene},
	{name: "one-market", durationSec: 12, Component: OneMarketScene},
	{name: "the-board-lights-up", durationSec: 11, Component: TheBoardLightsUpScene},
	{name: "the-desk", durationSec: 8, Component: TheDeskScene},
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
