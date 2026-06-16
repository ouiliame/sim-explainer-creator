import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {SourceCard} from "../../../components";
import {SOURCES} from "../preludeLayout";

// KF0-3: blank → first sources appear → more variety. Each card fades + slides
// up into its scattered position. No center activity yet.
export const ScatteredSourcesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{SOURCES.map((src) => {
				const startFrame = src.appearAt * fps;
				const endFrame = startFrame + 0.5 * fps;
				const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: EASING.out,
				});
				const ty = (1 - t) * 18;
				return (
					<div
						key={src.label}
						style={{
							position: "absolute",
							left: src.x,
							top: src.y,
							transform: `translateY(${ty}px)`,
							opacity: t,
						}}
					>
						<SourceCard
							kind={src.kind}
							label={src.label}
							subtitle={src.subtitle}
							size={src.size}
						/>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
