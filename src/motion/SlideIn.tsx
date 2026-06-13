import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DURATION, EASING} from "../theme";

type Direction = "left" | "right" | "up" | "down";

type Props = {
	delay?: number;
	duration?: number;
	from?: Direction;
	distance?: number;
	fade?: boolean;
	children: React.ReactNode;
};

export const SlideIn: React.FC<Props> = ({
	delay = 0,
	duration = DURATION.base,
	from = "up",
	distance = 40,
	fade = true,
	children,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const start = delay * fps;
	const end = start + duration * fps;

	const progress = interpolate(frame, [start, end], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const axis = from === "left" || from === "right" ? "X" : "Y";
	const sign = from === "left" || from === "up" ? -1 : 1;
	const offset = sign * distance * (1 - progress);

	return (
		<div
			style={{
				transform: `translate${axis}(${offset}px)`,
				opacity: fade ? progress : 1,
			}}
		>
			{children}
		</div>
	);
};
