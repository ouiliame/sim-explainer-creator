import React from "react";
import {COLORS, RADIUS, SHADOW, SPACING, TYPE} from "../theme";

type Props = {
	title?: string;
	width?: number;
	height?: number;
	children?: React.ReactNode;
};

export const WorkspaceFrame: React.FC<Props> = ({
	title = "my workspace",
	width = 1280,
	height = 720,
	children,
}) => {
	return (
		<div
			style={{
				width,
				height,
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border}`,
				borderRadius: RADIUS.lg,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				boxShadow: SHADOW.overlay,
			}}
		>
			<div
				style={{
					height: 56,
					backgroundColor: COLORS.surface3,
					borderBottom: `1px solid ${COLORS.border}`,
					display: "flex",
					alignItems: "center",
					paddingLeft: SPACING.md,
					paddingRight: SPACING.md,
					gap: SPACING.xs,
				}}
			>
				<Dot color="#ff5f57" />
				<Dot color="#febc2e" />
				<Dot color="#28c840" />
				<div style={{...TYPE.label, fontSize: 22, color: COLORS.textMuted, marginLeft: SPACING.sm}}>
					{title}
				</div>
			</div>
			<div
				style={{
					flex: 1,
					padding: SPACING.lg,
					display: "flex",
					flexDirection: "column",
					gap: SPACING.lg,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{children}
			</div>
		</div>
	);
};

const Dot: React.FC<{color: string}> = ({color}) => (
	<div
		style={{
			width: 14,
			height: 14,
			borderRadius: 99,
			backgroundColor: color,
			opacity: 0.85,
		}}
	/>
);
