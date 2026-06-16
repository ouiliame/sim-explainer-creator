import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {
	HUB_POS,
	NON_MEMBERS,
	RES_BOUNDS,
	RES_POS,
	RESOURCES,
	SPOKES,
	spokePos,
	WF_BOUNDS,
	WF_POS,
} from "../layout-v2";
import {ClusterPanel, FieldTile, SpokeLines, SpokePulse} from "./_local";

// Scene 3 — wired together (hub-and-spokes). The panels dissolve, the
// workflow glides to center, the resources fan onto the ring, the four
// non-members rejoin it (Mothership at the top). Spokes draw; wire light
// shows each relationship's direction: Mothership → workflow (builds it),
// resources → workflow (it reads them), workflow → tool/deployment/logs
// (it acts, ships, leaves a record).
// Beat intent: an AI system is a workflow wired to your resources — and
// Mothership builds it for you.
// Enter == scene 2 exit; exit == scene 4 enter (hub at rest, spokes drawn).
export const WiredTogetherScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const panelOp = interpolate(t, [0.3, 1.0], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.in,
	});

	const move = interpolate(t, [1.0, 2.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const lerp = (a: {x: number; y: number}, b: {x: number; y: number}) => ({
		x: a.x + (b.x - a.x) * move,
		y: a.y + (b.y - a.y) * move,
	});

	// Non-members rejoin on the ring.
	const rejoin = (i: number) =>
		interpolate(t, [2.4 + i * 0.18, 3.0 + i * 0.18], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Spokes draw outward once everything is seated.
	const spokeDraw = (i: number) =>
		interpolate(t, [3.6 + i * 0.14, 4.15 + i * 0.14], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Wire light, three waves: the builder, the reads, the outputs.
	const pulseP = (t0: number) =>
		interpolate(t, [t0, t0 + 1.2], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});

	const wfPos = lerp(WF_POS, HUB_POS);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Cluster boundaries dissolving */}
			<ClusterPanel {...RES_BOUNDS} opacity={panelOp} />
			<ClusterPanel {...WF_BOUNDS} opacity={panelOp} />

			{/* Spokes (behind tiles) */}
			<SpokeLines draw={spokeDraw} />

			{/* Wire light */}
			<SpokePulse kind="mothership" p={pulseP(5.4)} inward />
			{RESOURCES.map((kind, i) => (
				<SpokePulse key={kind} kind={kind} p={pulseP(7.0 + i * 0.25)} inward />
			))}
			{(["tool", "deployment", "logs"] as const).map((kind, i) => (
				<SpokePulse key={kind} kind={kind} p={pulseP(9.0 + i * 0.25)} />
			))}

			{/* Resources gliding from the stack onto the ring */}
			{RESOURCES.map((kind) => {
				const pos = lerp(RES_POS[kind], spokePos(SPOKES.find((s) => s.kind === kind)!.angle));
				return <FieldTile key={kind} kind={kind} x={pos.x} y={pos.y} />;
			})}

			{/* Non-members rejoining the ring */}
			{NON_MEMBERS.map((kind, i) => {
				const p = rejoin(i);
				const pos = spokePos(SPOKES.find((s) => s.kind === kind)!.angle);
				return <FieldTile key={kind} kind={kind} x={pos.x} y={pos.y + (1 - p) * 20} opacity={p} />;
			})}

			{/* The workflow takes the center */}
			<FieldTile kind="workflow" x={wfPos.x} y={wfPos.y} />
		</AbsoluteFill>
	);
};
