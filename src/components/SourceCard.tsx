import React from "react";
import {COLORS, RADIUS, SHADOW, TYPE} from "../theme";
import {SourceIconByKind, type SourceKind} from "./BrandIcons";

type Props = {
	kind: SourceKind;
	label: string;
	size?: "sm" | "md" | "lg";
	subtitle?: string;
};

const SIZES = {
	sm: {w: 168, h: 56, icon: 24, label: 16, sub: 12},
	md: {w: 220, h: 76, icon: 32, label: 20, sub: 14},
	lg: {w: 280, h: 92, icon: 40, label: 24, sub: 15},
} as const;

// A floating "source of knowledge" card used in the problem-exposition prelude.
// Visually richer than DocumentCard so it can carry brand icons and tell the
// story of fragmented knowledge across different tools.
export const SourceCard: React.FC<Props> = ({kind, label, size = "md", subtitle}) => {
	const s = SIZES[size];
	const Icon = SourceIconByKind[kind];
	return (
		<div
			style={{
				width: s.w,
				height: s.h,
				backgroundColor: COLORS.surface3,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: RADIUS.md,
				padding: 14,
				display: "flex",
				alignItems: "center",
				gap: 14,
				boxSizing: "border-box",
				boxShadow: SHADOW.subtle,
			}}
		>
			<div
				style={{
					width: s.icon + 8,
					height: s.icon + 8,
					backgroundColor: COLORS.surface4,
					border: `1px solid ${COLORS.border}`,
					borderRadius: RADIUS.sm,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<Icon size={s.icon} />
			</div>
			<div style={{display: "flex", flexDirection: "column", gap: 2, overflow: "hidden", flex: 1}}>
				<div
					style={{
						...TYPE.label,
						fontSize: s.label,
						color: COLORS.text,
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{label}
				</div>
				{subtitle ? (
					<div style={{...TYPE.micro, fontSize: s.sub, color: COLORS.textMuted}}>
						{subtitle}
					</div>
				) : null}
			</div>
		</div>
	);
};
