import React from "react";
import {COLORS, RADIUS, SHADOW, TYPE} from "../theme";
import {
	AgentGlyph,
	DeploymentGlyph,
	FileGlyph,
	KnowledgeGlyph,
	LogsGlyph,
	MothershipGlyph,
	TableGlyph,
	ToolGlyph,
	WorkflowGlyph,
} from "./ObjectIcons";

// The core Sim object model as a single typed vocabulary. Every Academy video
// arranges these tiles, so the look is consistent across the whole series.
export type ObjectKind =
	| "mothership"
	| "workflow"
	| "table"
	| "knowledge"
	| "file"
	| "agent"
	| "tool"
	| "logs"
	| "deployment";

type Spec = {label: string; accent: string; Glyph: React.FC<{size?: number; color?: string}>};

// Chip colors follow Sim's real block registry where one exists (start #34B5FF,
// agent/brand #701ffc, knowledge #00B0B0, response #2F55FF) and stay in the
// same tight family elsewhere. Color lives ONLY in the solid icon chip — cards
// are neutral. White glyphs on solid chips, like Sim's production blocks.
export const OBJECTS: Record<ObjectKind, Spec> = {
	mothership: {label: "Mothership", accent: COLORS.brand, Glyph: MothershipGlyph},
	workflow: {label: "Workflow", accent: "#34B5FF", Glyph: WorkflowGlyph},
	table: {label: "Table", accent: "#10B981", Glyph: TableGlyph},
	knowledge: {label: "Knowledge Base", accent: "#00B0B0", Glyph: KnowledgeGlyph},
	file: {label: "File", accent: "#F59E0B", Glyph: FileGlyph},
	agent: {label: "Agent", accent: COLORS.brand, Glyph: AgentGlyph},
	tool: {label: "Tool", accent: "#6366F1", Glyph: ToolGlyph},
	logs: {label: "Logs", accent: "#525252", Glyph: LogsGlyph},
	deployment: {label: "Deployment", accent: "#2F55FF", Glyph: DeploymentGlyph},
};

type Layout = "tile" | "row" | "icon";

type Props = {
	kind: ObjectKind;
	label?: string; // override the default label
	subtitle?: string;
	layout?: Layout; // tile = vertical card, row = horizontal chip, icon = glyph only
	width?: number;
	height?: number;
	accent?: string; // override accent
	dimmed?: boolean;
};

const SIZES = {
	tile: {w: 240, h: 200, icon: 56, label: 26, sub: 17, gap: 18, pad: 24},
	row: {w: 360, h: 96, icon: 40, label: 24, sub: 16, gap: 16, pad: 18},
	icon: {w: 96, h: 96, icon: 48, label: 0, sub: 0, gap: 0, pad: 0},
} as const;

export const ObjectNode: React.FC<Props> = ({
	kind,
	label,
	subtitle,
	layout = "tile",
	width,
	height,
	accent,
	dimmed = false,
}) => {
	const spec = OBJECTS[kind];
	const s = SIZES[layout];
	const color = accent ?? spec.accent;
	const Glyph = spec.Glyph;
	const isIconOnly = layout === "icon";

	// Neutral card; the only color is the solid icon chip with a white glyph.
	return (
		<div
			style={{
				width: width ?? s.w,
				height: height ?? s.h,
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: RADIUS.md,
				boxShadow: SHADOW.subtle,
				boxSizing: "border-box",
				padding: s.pad,
				display: "flex",
				flexDirection: layout === "tile" ? "column" : "row",
				alignItems: "center",
				justifyContent: "center",
				gap: s.gap,
				opacity: dimmed ? 0.35 : 1,
			}}
		>
			<div
				style={{
					width: s.icon + 14,
					height: s.icon + 14,
					borderRadius: 9,
					backgroundColor: color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<Glyph size={Math.round(s.icon * 0.62)} color="#ffffff" />
			</div>
			{!isIconOnly ? (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 4,
						alignItems: layout === "tile" ? "center" : "flex-start",
						overflow: "hidden",
					}}
				>
					<div style={{...TYPE.label, fontSize: s.label, color: COLORS.text, whiteSpace: "nowrap"}}>
						{label ?? spec.label}
					</div>
					{subtitle ? (
						<div
							style={{
								...TYPE.micro,
								fontSize: s.sub,
								color: COLORS.textMuted,
								textAlign: layout === "tile" ? "center" : "left",
							}}
						>
							{subtitle}
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
};
