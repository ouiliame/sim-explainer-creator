import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, WirePulse} from "../../../components";
import {CHAIN_EDGE_Y, edgeX1, edgeX2} from "../../module-1-workflows/layout";
import {Chain} from "../../module-1-workflows/scenes/_local";
import {HUB_POS, SPOKES, spokeAngle, spokePos, ZOOM_SCALE} from "../layout-v2";
import {FieldTile, SpokeLines} from "./_local";

// Scene 5 — into the workflow (zoom-through, the hook). The ring recedes;
// the camera pushes into the Workflow tile until it gives way to the builder
// canvas, where module-1's chain assembles — the docs' own CLASSIFY example,
// at module-1's exact geometry: the frame the next video opens on. One pulse
// of light crosses the wires; hold on the threshold.
// Beat intent: workflows are where we start — next video, we go inside.
// Enter == scene 4 exit; the final frame is the hand-off to module 1.
export const IntoTheWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Satellites and spokes recede.
	const ringOp = interpolate(t, [0.5, 1.4], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.in,
	});

	// Camera push into the hub tile (it sits at stage center — pure scale).
	const z = interpolate(t, [1.4, 3.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const outerScale = 1 + (ZOOM_SCALE - 1) * z;
	const outerOp = interpolate(t, [2.6, 3.3], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// The canvas settles in underneath.
	const canvasOp = interpolate(t, [2.7, 3.6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const canvasScale = interpolate(t, [2.7, 3.8], [0.82, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Chain reveal — the docs stagger: block, edge, block, edge, block.
	const reveal = (t0: number, dur: number) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The teaser: one sweep of wire light, edge 1 then edge 2. No rings, no
	// resolutions — the promise, not the lesson.
	const pulse1 = interpolate(t, [6.8, 7.8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pulse2 = interpolate(t, [7.7, 8.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Canvas layer (revealed by the zoom) */}
			{canvasOp > 0 ? (
				<div style={{position: "absolute", inset: 0, opacity: canvasOp}}>
					<CanvasDots />
					<div
						style={{
							position: "absolute",
							inset: 0,
							transform: `scale(${canvasScale})`,
							transformOrigin: "50% 50%",
						}}
					>
						<Chain
							start={{opacity: reveal(4.2, 0.45)}}
							agent={{opacity: reveal(4.7, 0.45)}}
							response={{opacity: reveal(5.2, 0.45)}}
							edge1={{progress: reveal(4.6, 0.4)}}
							edge2={{progress: reveal(5.1, 0.4)}}
						/>
						<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
						<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
					</div>
				</div>
			) : null}

			{/* The hub, zooming away */}
			{outerOp > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: outerOp,
						transform: `scale(${outerScale})`,
						transformOrigin: "50% 50%",
					}}
				>
					{ringOp > 0 ? (
						<>
							<SpokeLines draw={() => 1} opacity={ringOp} />
							{SPOKES.map((spoke) => {
								const pos = spokePos(spokeAngle(spoke.kind));
								return (
									<FieldTile
										key={spoke.kind}
										kind={spoke.kind}
										x={pos.x}
										y={pos.y}
										opacity={ringOp}
									/>
								);
							})}
						</>
					) : null}
					<FieldTile kind="workflow" x={HUB_POS.x} y={HUB_POS.y} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
