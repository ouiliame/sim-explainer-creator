import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	ExplorationLoopScene,
	ObjectModelScene,
	SystemCombinesScene,
	WhatIsSimScene,
} from "./scenes";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

export const SCENES: SceneDef[] = [
	{name: "what-is-sim", durationSec: 5, Component: WhatIsSimScene},
	{name: "object-model", durationSec: 9, Component: ObjectModelScene},
	{name: "system-combines", durationSec: 8, Component: SystemCombinesScene},
	{name: "exploration-loop", durationSec: 6, Component: ExplorationLoopScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const IntroVideo: React.FC = () => {
	let cursor = 0;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, color: COLORS.text}}>
			{SCENES.map((scene) => {
				const from = cursor;
				const durationInFrames = seconds(scene.durationSec);
				cursor += durationInFrames;
				const Scene = scene.Component;
				return (
					<Sequence key={scene.name} from={from} durationInFrames={durationInFrames} layout="none" name={scene.name}>
						<Scene />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
