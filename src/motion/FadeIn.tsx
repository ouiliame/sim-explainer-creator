import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DURATION, EASING} from "../theme";

type Props = {
	delay?: number;
	duration?: number;
	from?: number;
	to?: number;
	children: React.ReactNode;
};

export const FadeIn: React.FC<Props> = ({
	delay = 0,
	duration = DURATION.base,
	from = 0,
	to = 1,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const start = delay * fps;
	const end = start + duration * fps;

	const opacity = interpolate(frame, [start, end], [from, to], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return <div style={{opacity}}>{children}</div>;
};
