import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DURATION, EASING} from "../theme";

type Props = {
	delay?: number;
	duration?: number;
	from?: number;
	to?: number;
	origin?: string;
	fade?: boolean;
	children: React.ReactNode;
};

export const Zoom: React.FC<Props> = ({
	delay = 0,
	duration = DURATION.slow,
	from = 1,
	to = 1.4,
	origin = "center center",
	fade = false,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const start = delay * fps;
	const end = start + duration * fps;

	const scale = interpolate(frame, [start, end], [from, to], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const opacity = fade
		? interpolate(frame, [start, end], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: EASING.out,
			})
		: 1;

	return (
		<div
			style={{
				transform: `scale(${scale})`,
				transformOrigin: origin,
				opacity,
				width: "100%",
				height: "100%",
			}}
		>
			{children}
		</div>
	);
};
