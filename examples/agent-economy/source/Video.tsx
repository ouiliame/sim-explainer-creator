import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {VO_TIMING} from "./vo-timing";
import {AnAgentYouBuiltScene} from "./scenes/AnAgentYouBuiltScene";
import {DeployAsAToolScene} from "./scenes/DeployAsAToolScene";
import {AStrangerCallsScene} from "./scenes/AStrangerCallsScene";
import {TheRushScene} from "./scenes/TheRushScene";
import {YouCallTheirsScene} from "./scenes/YouCallTheirsScene";
import {TheAgentEconomyScene} from "./scenes/TheAgentEconomyScene";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// The Agent Economy (v1 — script-v1.md). One idea: deploy a workflow as an
// MCP tool and other agents call it like a function; the same protocol
// lets your agent call theirs. One set piece (the Scout chain + the
// product's MCP client list as caller badges + the partner server); nine
// justified runs, the four in the rush deliberately compressed — the
// multiplicity is the lesson.
const BASE_SCENES: SceneDef[] = [
	{name: "an-agent-you-built", durationSec: 9, Component: AnAgentYouBuiltScene},
	{name: "deploy-as-a-tool", durationSec: 10, Component: DeployAsAToolScene},
	{name: "a-stranger-calls", durationSec: 11, Component: AStrangerCallsScene},
	{name: "the-rush", durationSec: 15, Component: TheRushScene},
	{name: "you-call-theirs", durationSec: 12, Component: YouCallTheirsScene},
	{name: "the-agent-economy", durationSec: 11, Component: TheAgentEconomyScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const AgentEconomyVideo: React.FC = () => {
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
