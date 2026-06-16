import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, TYPE} from "../../../theme";
import {FadeIn, SlideIn} from "../../../motion";
import {WorkspaceFrame} from "../../../components";

// Macro framing: the workspace appears, one-line definition fades in.
export const WhatIsSimScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const lineOp = interpolate(frame, [1.2 * fps, 2.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center"}}>
			<FadeIn delay={0} duration={0.6}>
				<SlideIn delay={0} duration={0.6} from="up" distance={18} fade={false}>
					<WorkspaceFrame title="my workspace">
						<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: lineOp}}>
							<div style={{...TYPE.title, fontSize: 56, color: COLORS.text}}>Sim</div>
							<div style={{...TYPE.body, fontSize: 30, color: COLORS.textMuted}}>
								a workbench for building AI systems
							</div>
						</div>
					</WorkspaceFrame>
				</SlideIn>
			</FadeIn>
		</AbsoluteFill>
	);
};
