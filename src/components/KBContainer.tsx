import React from "react";
import {COLORS, RADIUS, SHADOW, SPACING, TYPE} from "../theme";
import {KBIcon} from "./KBIcon";

type Props = {
	name?: string;
	width?: number;
	height?: number;
	children?: React.ReactNode;
	docCount?: number;
	connectorBadges?: string[];
};

export const KBContainer: React.FC<Props> = ({
	name = "Knowledge Base",
	width = 320,
	height = 220,
	children,
	docCount,
	connectorBadges,
}) => {
	return (
		<div
			style={{
				width,
				height,
				backgroundColor: COLORS.surface3,
				border: `1px solid ${COLORS.border}`,
				borderRadius: RADIUS.md,
				padding: SPACING.md,
				display: "flex",
				flexDirection: "column",
				gap: SPACING.sm,
				boxSizing: "border-box",
				boxShadow: SHADOW.card,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: SPACING.xs,
				}}
			>
				<div style={{display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1}}>
					<KBIcon size={28} color={COLORS.knowledge} />
					<div
						style={{
							...TYPE.label,
							fontSize: 24,
							color: COLORS.text,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{name}
					</div>
				</div>
				{docCount !== undefined ? (
					<div
						style={{
							...TYPE.micro,
							color: COLORS.textTertiary,
							backgroundColor: COLORS.surface4,
							border: `1px solid ${COLORS.border}`,
							borderRadius: RADIUS.xs,
							padding: "4px 10px",
							whiteSpace: "nowrap",
							flexShrink: 0,
						}}
					>
						{docCount} {docCount === 1 ? "doc" : "docs"}
					</div>
				) : null}
			</div>

			{connectorBadges && connectorBadges.length > 0 ? (
				<div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
					{connectorBadges.map((b) => (
						<div
							key={b}
							style={{
								...TYPE.micro,
								color: COLORS.textTertiary,
								backgroundColor: COLORS.surface4,
								border: `1px solid ${COLORS.border}`,
								borderRadius: RADIUS.xs,
								padding: "3px 8px",
							}}
						>
							{b}
						</div>
					))}
				</div>
			) : null}

			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 8,
					alignContent: "flex-start",
					overflow: "hidden",
				}}
			>
				{children}
			</div>
		</div>
	);
};
