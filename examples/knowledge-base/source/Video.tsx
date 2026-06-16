import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	ChunkingScene,
	ContextInjectionScene,
	ContextOverloadScene,
	DocumentsScene,
	KBAppearsScene,
	MultiKnowledgeBaseScene,
	OutputScene,
	QueryScene,
	RelevantChunksScene,
	RerankingScene,
	ReturnToKBScene,
	ScatteredSourcesScene,
	SearchEmergeScene,
	UpdateScene,
	WorkspaceScene,
	ZoomIntoDocScene,
	ZoomIntoKBScene,
} from "./scenes";

type SceneDef = {
	name: string;
	durationSec: number;
	Component: React.FC;
};

export const SCENES: SceneDef[] = [
	// --- Problem exposition prelude ---
	{name: "scattered-sources", durationSec: 7, Component: ScatteredSourcesScene},
	{name: "context-overload", durationSec: 8, Component: ContextOverloadScene},
	{name: "search-emerge", durationSec: 5, Component: SearchEmergeScene},
	{name: "kb-appears", durationSec: 6, Component: KBAppearsScene},

	// --- Mechanism section (existing) ---
	{name: "workspace", durationSec: 4, Component: WorkspaceScene},
	{name: "multi-kb", durationSec: 4, Component: MultiKnowledgeBaseScene},
	{name: "zoom-into-kb", durationSec: 3.5, Component: ZoomIntoKBScene},
	{name: "documents", durationSec: 5, Component: DocumentsScene},
	{name: "zoom-into-doc", durationSec: 2.5, Component: ZoomIntoDocScene},
	{name: "chunking", durationSec: 4, Component: ChunkingScene},
	{name: "update", durationSec: 4, Component: UpdateScene},
	{name: "return-to-kb", durationSec: 2.5, Component: ReturnToKBScene},
	{name: "query", durationSec: 3.5, Component: QueryScene},
	{name: "relevant-chunks", durationSec: 4, Component: RelevantChunksScene},
	{name: "reranking", durationSec: 3.5, Component: RerankingScene},
	{name: "context-injection", durationSec: 4, Component: ContextInjectionScene},
	{name: "output", durationSec: 6, Component: OutputScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const KnowledgeBaseVideo: React.FC = () => {
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
