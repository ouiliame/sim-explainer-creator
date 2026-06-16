import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode, OBJECTS} from "../../../components";
import {OBJECT_GRID, STAGE_H, STAGE_W, SYSTEM_HUB, SYSTEM_SPOKES, TILE, tileCenter} from "../layout";

// A real system lights up across the tiles: the Workflow (hub) reads a
// Knowledge Base, writes a Table, saves a File, emits Logs. Objects not in the
// system dim back; connector lines trace the flow from the workflow outward.
export const SystemCombinesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const inSystem = (kind: string) => kind === SYSTEM_HUB || SYSTEM_SPOKES.includes(kind as never);

	// Non-system tiles dim out 0-0.8s
	const dimT = interpolate(frame, [0, 0.8 * fps], [1, 0.22], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Connector lines draw from the hub to each spoke, staggered
	const lineT = (i: number) =>
		interpolate(frame, [(1.0 + i * 0.4) * fps, (1.8 + i * 0.4) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});

	const hub = tileCenter(SYSTEM_HUB);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Connector lines */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{SYSTEM_SPOKES.map((kind, i) => {
					const t = lineT(i);
					const c = tileCenter(kind);
					const len = Math.hypot(c.x - hub.x, c.y - hub.y);
					return (
						<line
							key={kind}
							x1={hub.x}
							y1={hub.y}
							x2={c.x}
							y2={c.y}
							stroke={OBJECTS[kind].accent}
							strokeWidth={2.5}
							strokeOpacity={t * 0.8}
							strokeDasharray={`${len * t} 9999`}
						/>
					);
				})}
			</svg>

			{/* Tiles — system ones stay lit, others dim */}
			{OBJECT_GRID.map((o) => (
				<div key={o.kind} style={{position: "absolute", left: o.x, top: o.y, opacity: inSystem(o.kind) ? 1 : dimT}}>
					<ObjectNode kind={o.kind} width={TILE.w} height={TILE.h} />
				</div>
			))}
		</AbsoluteFill>
	);
};
