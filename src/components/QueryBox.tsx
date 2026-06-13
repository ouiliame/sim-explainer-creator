import React from "react";
import {COLORS, SHADOW, SPACING, TYPE} from "../theme";

type Props = {
	text: string;
	width?: number;
};

export const QueryBox: React.FC<Props> = ({text, width = 640}) => {
	return (
		<div
			style={{
				width,
				height: 88,
				backgroundColor: COLORS.surface3,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: 44,
				paddingLeft: SPACING.lg,
				paddingRight: SPACING.lg,
				display: "flex",
				alignItems: "center",
				gap: SPACING.sm,
				boxSizing: "border-box",
				boxShadow: SHADOW.medium,
			}}
		>
			<div
				style={{
					width: 22,
					height: 22,
					borderRadius: 99,
					border: `2px solid ${COLORS.textMuted}`,
					flexShrink: 0,
				}}
			/>
			<div
				style={{
					...TYPE.body,
					fontSize: 28,
					color: COLORS.text,
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "ellipsis",
				}}
			>
				{text}
			</div>
		</div>
	);
};
