import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {SCENE_LIST, sceneSeconds, type SceneName} from "./timing";
import {TheWorkflowScene} from "./scenes/TheWorkflowScene";
import {TheRunFiresScene} from "./scenes/TheRunFiresScene";
import {CallsConnectScene} from "./scenes/CallsConnectScene";
import {OneConversationScene} from "./scenes/OneConversationScene";
import {ThreeAtOnceScene} from "./scenes/ThreeAtOnceScene";
import {OutcomesLandScene} from "./scenes/OutcomesLandScene";
import {TheCampaignRanScene} from "./scenes/TheCampaignRanScene";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// The Voice Agent, take 2 (script-v1.md) — hype reel 3, corrected
// architecture: a clean product-true workflow (Start → Campaign → Parallel
// "Call each" with ONE inner lane: Call → Log outcome) + the loved call
// panels and the real outcomes SimTable as SEPARATE aside boxes in their
// own band. 1 run. Authored durations (the visual minimums) and the
// extend-only VO re-timing live in timing.ts, shared with the scenes so
// their global oscillator clocks stay continuous across cuts.
const COMPONENTS: Record<SceneName, React.FC> = {
	"the-workflow": TheWorkflowScene,
	"the-run-fires": TheRunFiresScene,
	"calls-connect": CallsConnectScene,
	"one-conversation": OneConversationScene,
	"three-at-once": ThreeAtOnceScene,
	"outcomes-land": OutcomesLandScene,
	"the-campaign-ran": TheCampaignRanScene,
};

export const SCENES: SceneDef[] = SCENE_LIST.map((s) => ({
	name: s.name,
	durationSec: sceneSeconds(s.name),
	Component: COMPONENTS[s.name],
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const VoiceAgentV2Video: React.FC = () => {
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
