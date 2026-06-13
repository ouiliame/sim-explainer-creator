import React from "react";
import {COLORS, RADIUS, SHADOW, SPACING, TYPE} from "../theme";

type Props = {
	label?: string;
	width?: number;
	height?: number;
};

export const AgentNode: React.FC<Props> = ({label = "model", width = 260, height = 170}) => {
	return (
		<div
			style={{
				width,
				height,
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: RADIUS.md,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				gap: SPACING.xs,
				boxSizing: "border-box",
				boxShadow: SHADOW.subtle,
			}}
		>
			<div
				style={{
					width: 48,
					height: 48,
					backgroundColor: COLORS.brand,
					borderRadius: 99,
				}}
			/>
			<div style={{...TYPE.label, fontSize: 26, color: COLORS.text}}>{label}</div>
		</div>
	);
};
