import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheBacklogScene} from "./scenes/TheBacklogScene";
import {FleetTakesShapeScene} from "./scenes/FleetTakesShapeScene";
import {WiredByReferenceScene} from "./scenes/WiredByReferenceScene";
import {LightsOutScene} from "./scenes/LightsOutScene";
import {MidnightScene} from "./scenes/MidnightScene";
import {TheFanScene} from "./scenes/TheFanScene";
import {OneEngineerScene} from "./scenes/OneEngineerScene";
import {TheWallScene} from "./scenes/TheWallScene";
import {MorningScene} from "./scenes/MorningScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// swe-fleet v1 (script-v1.md) — the overnight engineering fleet: a table
// holds the backlog, a schedule fires at midnight, a Parallel container
// fans one coding lane (Agent → GitHub → Table) into five concurrent
// engineers, and the table's status column becomes the record. ONE run
// spans scenes 5→8 through three freeze-cuts (container live → fan live
// + tag resolved → lane done + row flipped).
// Authored durations are the visual minimums; vo-sync re-times each
// scene to its narration (extend-only).
const BASE_SCENES: SceneDef[] = [
	{name: "the-backlog", durationSec: 8, Component: TheBacklogScene},
	{name: "the-fleet-takes-shape", durationSec: 16, Component: FleetTakesShapeScene},
	{name: "wired-by-reference", durationSec: 11, Component: WiredByReferenceScene},
	{name: "lights-out", durationSec: 6, Component: LightsOutScene},
	{name: "midnight", durationSec: 11, Component: MidnightScene},
	{name: "the-fan", durationSec: 12, Component: TheFanScene},
	{name: "one-engineer", durationSec: 20, Component: OneEngineerScene},
	{name: "the-wall", durationSec: 13, Component: TheWallScene},
	{name: "morning", durationSec: 8, Component: MorningScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const SweFleetVideo: React.FC = () => {
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
