import React from "react";
import {COLORS, RADIUS, SPACING, TYPE} from "../theme";

type Props = {
	title?: string;
	width?: number;
	height?: number;
	children?: React.ReactNode;
};

export const ContextPanel: React.FC<Props> = ({
	title = "model context",
	width = 480,
	height = 360,
	children,
}) => {
	return (
		<div
			style={{
				width,
				height,
				backgroundColor: COLORS.surface1,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: RADIUS.md,
				padding: SPACING.sm,
				display: "flex",
				flexDirection: "column",
				gap: SPACING.sm,
				boxSizing: "border-box",
			}}
		>
			<div
				style={{
					...TYPE.micro,
					color: COLORS.secondary,
					textTransform: "uppercase",
					letterSpacing: 1.4,
				}}
			>
				{title}
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 6,
				}}
			>
				{children}
			</div>
		</div>
	);
};
