import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../../../theme";
import type {ObjectKind} from "../../../components";
import {HUB_POS, SPOKES, spokeAngle, spokePos} from "../layout-v2";
import {FieldTile, SpokeLines} from "./_local";

// Scene 4 — the series (preview-glance). The hub holds perfectly still; a
// blue selection ring visits each tile in module order. Names only —
// nothing moves, nothing is taught.
// Beat intent: every one of these is a stop on this series.
// Enter == scene 3 exit; exit == scene 5 enter (hub at rest, no ring lit).
const SERIES_ORDER: ObjectKind[] = [
	"mothership",
	"workflow",
	"table",
	"knowledge",
	"file",
	"tool",
	"deployment",
	"logs",
];

export const TheSeriesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Ring envelope: in 0.2s, hold 0.55s, out 0.25s — fully dark by the cut.
	const ringFor = (kind: ObjectKind) => {
		const i = SERIES_ORDER.indexOf(kind);
		const t0 = 0.8 + i * 1.05;
		return interpolate(t, [t0, t0 + 0.2, t0 + 0.75, t0 + 1.0], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<SpokeLines draw={() => 1} />
			{SPOKES.map((spoke) => {
				const pos = spokePos(spokeAngle(spoke.kind));
				return (
					<FieldTile
						key={spoke.kind}
						kind={spoke.kind}
						x={pos.x}
						y={pos.y}
						ring={ringFor(spoke.kind)}
					/>
				);
			})}
			<FieldTile kind="workflow" x={HUB_POS.x} y={HUB_POS.y} ring={ringFor("workflow")} />
		</AbsoluteFill>
	);
};
