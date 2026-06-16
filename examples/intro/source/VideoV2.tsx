import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {VO_TIMING} from "./vo-timing";
import {
	IntoTheWorkflowScene,
	OneSurfaceScene,
	TheSeriesScene,
	TwoKindsScene,
	WiredTogetherScene,
} from "./scenes-v2";

// Intro v2 — "The shape of a workspace". Registered as `intro-v2` alongside
// the original intro; see script-v2.md for the locked scene list.
type SceneDef = {name: string; durationSec: number; Component: React.FC};

const BASE_SCENES: SceneDef[] = [
	{name: "one-surface", durationSec: 10, Component: OneSurfaceScene},
	{name: "two-kinds", durationSec: 11, Component: TwoKindsScene},
	{name: "wired-together", durationSec: 14, Component: WiredTogetherScene},
	{name: "the-series", durationSec: 11, Component: TheSeriesScene},
	{name: "into-the-workflow", durationSec: 14, Component: IntoTheWorkflowScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const IntroV2Video: React.FC = () => {
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
