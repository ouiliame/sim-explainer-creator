import React from "react";
import {COLORS, RADIUS, TYPE} from "../theme";
import {KBIcon} from "./KBIcon";

type Props = {
	label: string;
	width?: number;
	accent?: string;
	subtitle?: string;
	iconSize?: number;
};

// Small "resource" tile used inside the workspace shell to indicate that
// something (e.g. Knowledge Base) is a first-class resource of the workspace.
export const ResourcePanel: React.FC<Props> = ({
	label,
	width = 420,
	accent = COLORS.knowledge,
	subtitle,
	iconSize = 32,
}) => {
	return (
		<div
			style={{
				width,
				backgroundColor: COLORS.surface3,
				border: `1px solid ${COLORS.border}`,
				borderRadius: RADIUS.md,
				padding: 18,
				display: "flex",
				alignItems: "center",
				gap: 16,
				boxSizing: "border-box",
			}}
		>
			<KBIcon size={iconSize} color={accent} />
			<div style={{display: "flex", flexDirection: "column", gap: 4}}>
				<div style={{...TYPE.label, fontSize: 26, color: COLORS.text}}>{label}</div>
				{subtitle ? (
					<div style={{...TYPE.micro, fontSize: 16, color: COLORS.textMuted}}>{subtitle}</div>
				) : null}
			</div>
		</div>
	);
};
