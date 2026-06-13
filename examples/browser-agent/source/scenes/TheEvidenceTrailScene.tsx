import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {cv, Rig} from "./_rig";

// Scene 7 — the evidence trail [settle / bookend]. The settled frame:
// chain green, filmstrip complete. The camera eases back; each evidence
// card takes one quiet pulse in call order — the trail retold without
// re-running. Hold the balanced frame for VO.
export const TheEvidenceTrailScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const s = interpolate(t, [0.8, 2.2], [1, 0.94], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const recap = (a: number) => Math.min(cv(t, a, a + 0.3), cv(t, a + 0.7, a + 1.1, 1, 0)) * 0.6;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<AbsoluteFill style={{transform: `scale(${s})`}}>
				<Rig
					start={{state: "ok"}}
					agent={{state: "ok"}}
					response={{state: "ok"}}
					toolsReveal={1}
					cards={[
						{reveal: 1, glow: recap(2.6)},
						{reveal: 1, glow: recap(3.3)},
						{reveal: 1, glow: recap(4.0)},
						{reveal: 1, glow: recap(4.7)},
					]}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
