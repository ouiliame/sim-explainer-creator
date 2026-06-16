import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "../../../components";
import {cameraTo, PANEL_HOME_X, PANEL_LEFT_X, STAGE_H, STAGE_W, ZOOM_SCALE, ZOOM_TARGET} from "../layout-v2";
import {CredChain, pulse01, ramp, RestWorld} from "./_shared";

// Scene 6 — the-unit (settle).
// The canvas folds back into the Workflow tile; the service tiles bow out;
// the panel glides home to center carrying everything it owns. One quiet
// recap pulse in claim order — tiles (objects), dots (members), port
// (credentials) — then hold the balanced frame.
export const TheUnitScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Reverse camera: the world comes back from inside the tile.
	const ret = ramp(t, 0.2, 2.2, EASING.inOut);
	const px = interpolate(ret, [0, 1], [ZOOM_TARGET.x, STAGE_W / 2]);
	const py = interpolate(ret, [0, 1], [ZOOM_TARGET.y, STAGE_H / 2]);
	const s = interpolate(ret, [0, 1], [ZOOM_SCALE, 1]);
	const {tx, ty} = cameraTo(px, py, s);

	const canvasOp = 1 - ramp(t, 0.2, 1.0, EASING.in);
	const canvasScale = interpolate(ramp(t, 0.2, 1.0), [0, 1], [1, 1.06]);
	const worldOp = ramp(t, 0.2, 0.8);
	const undim = ramp(t, 1.4, 2.4, EASING.out);

	// The outside world bows out; the box is the unit.
	const servicesOp = 1 - ramp(t, 2.4, 3.4, EASING.in);
	const glide = ramp(t, 3.2, 4.8, EASING.inOut);
	const panelX = interpolate(glide, [0, 1], [PANEL_LEFT_X, PANEL_HOME_X]);

	// Recap, in claim order: objects → members → credentials.
	const tilePulse = [0, 1, 2, 3].map((i) => pulse01(t, 5.2 + i * 0.14, 6.0 + i * 0.14));
	const memberRing = pulse01(t, 6.0, 6.9);
	const portGlow = pulse01(t, 6.8, 7.7);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{worldOp > 0 ? (
				<div style={{position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0"}}>
					<RestWorld
						panelX={panelX}
						opacity={worldOp}
						dimExceptWorkflow={1 - undim}
						servicesOp={servicesOp}
						tilePulse={tilePulse}
						memberRing={memberRing}
						portGlow={portGlow}
					/>
				</div>
			) : null}

			{canvasOp > 0 ? (
				<div style={{position: "absolute", inset: 0, opacity: canvasOp, transform: `scale(${canvasScale})`, transformOrigin: "50% 50%"}}>
					<CanvasDots />
					<CredChain />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
