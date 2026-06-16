import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {AToolInActionScene} from "./scenes/AToolInActionScene";
import {TheSchemaScene} from "./scenes/TheSchemaScene";
import {TheCodeScene} from "./scenes/TheCodeScene";
import {OntoTheTableScene} from "./scenes/OntoTheTableScene";
import {TheAgentDecidesScene} from "./scenes/TheAgentDecidesScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// Custom tools — giving agents new moves (script-v1.md). Capability-first on
// the module-5 Triage chain: the CRM chip the audience already watched fire
// IS a custom tool; the editor aside walks the two-part anatomy (schema the
// model reads / code that runs) on the docs' own get_weather example; the
// saved tool lands on the agent's tool line; the closing run settles green
// with the model picking its tool. Two runs total.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "a-tool-in-action", durationSec: 10, Component: AToolInActionScene},
	{name: "the-schema", durationSec: 11, Component: TheSchemaScene},
	{name: "the-code", durationSec: 12, Component: TheCodeScene},
	{name: "onto-the-table", durationSec: 8, Component: OntoTheTableScene},
	{name: "the-agent-decides", durationSec: 8, Component: TheAgentDecidesScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const CustomToolsVideo: React.FC = () => {
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
