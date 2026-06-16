import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	BoundaryScene,
	CredentialScopeScene,
	CustomerAppScene,
	HandoffChecklistScene,
	IntegrationVsCredentialScene,
	InternalVsExternalScene,
	OwnYourSecretsScene,
	PersonalVsTeamScene,
	RolesLadderScene,
	WhatLivesInsideScene,
	WhyCredentialsScene,
	WhyPermissionsScene,
} from "./scenes";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// Module 8 concept beats only — the four [SCREEN-REC] demos are captured from the
// live product and intercut separately, so they're not in this composition.
export const SCENES: SceneDef[] = [
	// Video 1 — Workspaces Intro
	{name: "workspace-is-a-boundary", durationSec: 6, Component: BoundaryScene},
	{name: "what-lives-inside", durationSec: 10, Component: WhatLivesInsideScene},
	{name: "personal-vs-team", durationSec: 8, Component: PersonalVsTeamScene},
	{name: "workspace-as-customer-app", durationSec: 6, Component: CustomerAppScene},
	// Video 2 — Credentials & Integrations
	{name: "why-credentials", durationSec: 6, Component: WhyCredentialsScene},
	{name: "integration-vs-credential", durationSec: 8, Component: IntegrationVsCredentialScene},
	{name: "personal-vs-workspace-credentials", durationSec: 8, Component: CredentialScopeScene},
	{name: "own-your-secrets", durationSec: 6, Component: OwnYourSecretsScene},
	// Video 3 — Permissions & Customer Handoff
	{name: "why-permissions", durationSec: 5, Component: WhyPermissionsScene},
	{name: "roles-ladder", durationSec: 8, Component: RolesLadderScene},
	{name: "internal-vs-external", durationSec: 6, Component: InternalVsExternalScene},
	{name: "handoff-checklist", durationSec: 9, Component: HandoffChecklistScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module8WorkspacesVideo: React.FC = () => {
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
