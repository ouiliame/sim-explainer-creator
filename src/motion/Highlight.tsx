import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, DURATION, EASING} from "../theme";

type Props = {
	active: boolean;
	delay?: number;
	duration?: number;
	color?: string;
	dimmed?: number;
	children: React.ReactNode;
};

export const Highlight: React.FC<Props> = ({
	active,
	delay = 0,
	duration = DURATION.base,
	color = COLORS.active,
	dimmed = 0.35,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const start = delay * fps;
	const end = start + duration * fps;

	const t = interpolate(frame, [start, end], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Starts neutral (opacity 1, no glow). Transitions to either active (glow) or inactive (dimmed).
	const targetOpacity = active ? 1 : dimmed;
	const targetGlow = active ? 1 : 0;
	const opacity = interpolate(t, [0, 1], [1, targetOpacity]);
	const glowAlpha = interpolate(t, [0, 1], [0, targetGlow]);
	const ringAlpha = Math.round(glowAlpha * 255)
		.toString(16)
		.padStart(2, "0");
	const haloAlpha = Math.round(glowAlpha * 0.33 * 255)
		.toString(16)
		.padStart(2, "0");

	return (
		<div
			style={{
				opacity,
				boxShadow: `0 0 0 1px ${color}${ringAlpha}, 0 0 40px ${color}${haloAlpha}`,
				borderRadius: "inherit",
			}}
		>
			{children}
		</div>
	);
};
