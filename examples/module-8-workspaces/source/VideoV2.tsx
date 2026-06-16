import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	ConnectAccountScene,
	MembersJoinScene,
	OneBoxScene,
	OneCredentialScene,
	TheBoundaryScene,
	TheUnitScene,
} from "./scenes-v2";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// Module 8 v2 — the boundary cut (see script-v2.md). One ~62s piece around a
// single set piece: the workspace panel. Registered alongside v1.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "one-box", durationSec: 8, Component: OneBoxScene},
	{name: "members-join", durationSec: 10, Component: MembersJoinScene},
	{name: "the-boundary", durationSec: 10, Component: TheBoundaryScene},
	{name: "connect-an-account", durationSec: 12, Component: ConnectAccountScene},
	{name: "one-credential-three-blocks", durationSec: 14, Component: OneCredentialScene},
	{name: "the-unit", durationSec: 8, Component: TheUnitScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module8WorkspacesV2Video: React.FC = () => {
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
