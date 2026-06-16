import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {OBJECTS} from "../../../components";
import {gridPos, NON_MEMBERS, RES_BOUNDS, RES_POS, RESOURCES, TILE, WF_BOUNDS, WF_POS} from "../layout-v2";
import {ClusterPanel, FieldTile} from "./_local";

// Scene 2 — two kinds (cluster-split). Resources glide into a left cluster
// (dots absorbed: they HOLD); the workflow stands alone on the right and
// emits run pulses (it DOES). The other four step back — they rejoin the
// frame on the ring in scene 3.
// Beat intent: two kinds of things — resources that hold, workflows that do.
// Enter == scene 1 exit (full grid); exit == scene 3 enter (clusters at
// rest, panels full, non-members off stage).
export const TwoKindsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Non-members step back.
	const leaveOp = interpolate(frame, [0.6 * fps, 1.5 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.in,
	});

	// Glide from grid position to cluster position.
	const move = interpolate(frame, [0.8 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const panelOp = interpolate(frame, [2.2 * fps, 2.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const lerp = (a: {x: number; y: number}, b: {x: number; y: number}) => ({
		x: a.x + (b.x - a.x) * move,
		y: a.y + (b.y - a.y) * move,
	});

	// Dots absorbed into the resource tiles, two waves.
	const WAVES = [3.4, 5.4];
	const dotTravel = (t0: number) =>
		interpolate(frame, [t0 * fps, (t0 + 1.1) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});

	// Run pulses radiating from the workflow tile.
	const rings = [3.6, 4.8, 6.0].map((t0) => {
		const p = interpolate(frame, [t0 * fps, (t0 + 1.1) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
		return {r: 60 + 90 * p, op: p > 0 && p < 1 ? 0.45 * (1 - p) : 0};
	});

	const wfPos = lerp(gridPos("workflow"), WF_POS);
	const wfCx = wfPos.x + TILE.w / 2;
	const wfCy = wfPos.y + TILE.h / 2;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Cluster boundaries (behind tiles) */}
			<ClusterPanel {...RES_BOUNDS} opacity={panelOp} />
			<ClusterPanel {...WF_BOUNDS} opacity={panelOp} />

			{/* Non-members stepping back */}
			{NON_MEMBERS.map((kind) => (
				<FieldTile key={kind} kind={kind} {...gridPos(kind)} opacity={leaveOp} />
			))}

			{/* Resource tiles gliding into the left cluster */}
			{RESOURCES.map((kind) => {
				const pos = lerp(gridPos(kind), RES_POS[kind]);
				return <FieldTile key={kind} kind={kind} x={pos.x} y={pos.y} />;
			})}

			{/* Dots absorbed into the resource tiles (they hold) */}
			{WAVES.map((wave) =>
				RESOURCES.map((kind, i) => {
					const t = dotTravel(wave + i * 0.15);
					if (t <= 0 || t >= 1 || move < 1) return null;
					const target = RES_POS[kind];
					const x0 = RES_BOUNDS.x - 120;
					const x1 = target.x + 26;
					const y = target.y + TILE.h / 2;
					const op = t < 0.12 ? t / 0.12 : t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1;
					return (
						<div
							key={`${wave}-${kind}`}
							style={{
								position: "absolute",
								left: x0 + (x1 - x0) * t,
								top: y - 5,
								width: 10,
								height: 10,
								borderRadius: 99,
								backgroundColor: "#7d7d7d",
								opacity: op,
							}}
						/>
					);
				}),
			)}

			{/* Run pulses radiating from the workflow (it does) */}
			{rings.map((ring, i) =>
				ring.op > 0 ? (
					<div
						key={i}
						style={{
							position: "absolute",
							left: wfCx - ring.r,
							top: wfCy - ring.r,
							width: ring.r * 2,
							height: ring.r * 2,
							borderRadius: 999,
							border: `2px solid ${OBJECTS.workflow.accent}`,
							opacity: ring.op,
						}}
					/>
				) : null,
			)}
			<FieldTile kind="workflow" x={wfPos.x} y={wfPos.y} />
		</AbsoluteFill>
	);
};
