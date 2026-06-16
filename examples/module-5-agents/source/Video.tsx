import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	AWorkflowThatReasonsScene,
	KnowledgeScene,
	MemoryScene,
	SkillsGuidanceScene,
	StructuredOutputScene,
	TheFullAgentScene,
	TheReasoningStepScene,
	ToolsToActScene,
	WhoDecidesScene,
} from "./scenes";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// The agents-as-workflows arc (building-agents docs): the chain that reasons →
// the reasoning step → the five gifts (tools, who-decides, skills, knowledge,
// memory, structured output) accumulating as real rows on the Agent block →
// the full lead scorer.
export const SCENES: SceneDef[] = [
	{name: "a-workflow-that-reasons", durationSec: 8, Component: AWorkflowThatReasonsScene},
	{name: "the-reasoning-step", durationSec: 9, Component: TheReasoningStepScene},
	{name: "tools-to-act", durationSec: 11, Component: ToolsToActScene},
	{name: "who-decides", durationSec: 10, Component: WhoDecidesScene},
	{name: "skills-guidance", durationSec: 9, Component: SkillsGuidanceScene},
	{name: "knowledge", durationSec: 7, Component: KnowledgeScene},
	{name: "memory", durationSec: 7, Component: MemoryScene},
	{name: "structured-output", durationSec: 8, Component: StructuredOutputScene},
	{name: "the-full-agent", durationSec: 11, Component: TheFullAgentScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module5AgentsVideo: React.FC = () => {
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
