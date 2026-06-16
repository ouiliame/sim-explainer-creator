import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots} from "../../../components";
import {cameraTo, PANEL_LEFT_X, STAGE_H, STAGE_W, ZOOM_SCALE, ZOOM_TARGET} from "../layout-v2";
import {CredChain, ramp, RestWorld} from "./_shared";

// Scene 5 — one-credential-three-blocks (the centerpiece).
// The camera pushes into the Workflow tile and we land on the docs' own
// credential-share example. The Credential block rings live, three pulses
// leave its handle together, and the three <credential.credentialId> tags
// resolve IN SYNC: select the credential once, every block follows.
// Resolutions revert; the scene ends at template state.
export const OneCredentialScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Everything but the Workflow tile recedes; the camera pushes in.
	const dimIn = ramp(t, 0.3, 1.0, EASING.out);
	const cam = ramp(t, 0.8, 2.4, EASING.inOut);
	const px = interpolate(cam, [0, 1], [STAGE_W / 2, ZOOM_TARGET.x]);
	const py = interpolate(cam, [0, 1], [STAGE_H / 2, ZOOM_TARGET.y]);
	const s = interpolate(cam, [0, 1], [1, ZOOM_SCALE]);
	const {tx, ty} = cameraTo(px, py, s);
	const worldOp = 1 - ramp(t, 2.0, 2.4);

	// The inner world arrives at rest (slight settle, no relayout).
	const canvasOp = ramp(t, 1.9, 2.4);
	const canvasScale = interpolate(ramp(t, 1.9, 2.6, EASING.out), [0, 1], [1.06, 1]);

	// Assemble (docs entrance: staggered blocks, edges draw on).
	const blockOp = [
		ramp(t, 2.6, 3.2, EASING.out),
		ramp(t, 3.0, 3.6, EASING.out),
		ramp(t, 3.25, 3.85, EASING.out),
		ramp(t, 3.5, 4.1, EASING.out),
	];
	const edge = [0, 1, 2].map((i) => ramp(t, 3.9 + i * 0.15, 4.7 + i * 0.15, EASING.out));

	// THE run: live ring → three pulses together → synchronized resolution.
	const credHi = t >= 5.0 && t < 6.8;
	const dotP = [0, 1, 2].map(() => ramp(t, 5.6, 6.8));
	const targetHi = [0, 1, 2].map(() => t >= 6.6 && t < 7.6);
	// Glow leads the resolution, then hands off to ResolvedTag's residual tint
	// (and must be 0 by scene end — the boundary carries template state).
	const tagGlow = ramp(t, 6.4, 6.8) * (1 - ramp(t, 7.6, 8.0));
	const resolve = Math.min(ramp(t, 7.0, 7.6), 1 - ramp(t, 11.0, 11.8));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* The outer world under the camera */}
			{worldOp > 0 ? (
				<div style={{position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0"}}>
					<RestWorld panelX={PANEL_LEFT_X} opacity={worldOp} dimExceptWorkflow={dimIn} />
				</div>
			) : null}

			{/* Inside the workflow */}
			{canvasOp > 0 ? (
				<div style={{position: "absolute", inset: 0, opacity: canvasOp, transform: `scale(${canvasScale})`, transformOrigin: "50% 50%"}}>
					<CanvasDots />
					<CredChain
						blockOp={blockOp}
						rise={blockOp}
						edge={edge}
						credHi={credHi}
						targetHi={targetHi}
						dotP={dotP}
						tagGlow={tagGlow}
						resolve={resolve}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
