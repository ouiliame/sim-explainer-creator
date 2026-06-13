import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DURATION, EASING} from "../theme";

type Props = {
	delay?: number;
	duration?: number;
	axis?: "x" | "y" | "both";
	from?: number;
	to?: number;
	children: React.ReactNode;
};

export const Expand: React.FC<Props> = ({
	delay = 0,
	duration = DURATION.slow,
	axis = "both",
	from = 0,
	to = 1,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const start = delay * fps;
	const end = start + duration * fps;

	const t = interpolate(frame, [start, end], [from, to], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const sx = axis === "y" ? 1 : t;
	const sy = axis === "x" ? 1 : t;

	return (
		<div
			style={{
				transform: `scale(${sx}, ${sy})`,
				transformOrigin: "center center",
				opacity: t,
			}}
		>
			{children}
		</div>
	);
};
