import React from "react";
import {COLORS, RADIUS, SHADOW, TYPE} from "../../../theme";
import {OBJECTS, type ObjectKind} from "../../../components";
import {RUN_BLOCK_H, RUN_BLOCK_W, RUN_GAP, RUN_STEPS} from "../layout";

// ────────────────────────────────────────────────────────────────────────────
// Local helpers for the Module 7 — Logs & Debugging video. None of these are
// promoted to src/components — they're specific to this module's diagrams.
// ────────────────────────────────────────────────────────────────────────────

export type RunStatus = "ok" | "failed" | "pending";

const STATUS_COLOR: Record<RunStatus, string> = {
	ok: COLORS.accent,
	failed: COLORS.error,
	pending: COLORS.textMuted,
};

// A small status badge (check / cross / dot) shown on a run block.
export const StatusBadge: React.FC<{status: RunStatus; size?: number}> = ({status, size = 30}) => {
	const color = STATUS_COLOR[status];
	const sw = 2.4;
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				backgroundColor: color + "22",
				border: `1.5px solid ${color}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw * 1.4} strokeLinecap="round" strokeLinejoin="round">
				{status === "ok" ? <polyline points="5 13 10 18 19 6" /> : null}
				{status === "failed" ? (
					<>
						<line x1="6" y1="6" x2="18" y2="18" />
						<line x1="18" y1="6" x2="6" y2="18" />
					</>
				) : null}
				{status === "pending" ? <circle cx="12" cy="12" r="3.5" fill={color} stroke="none" /> : null}
			</svg>
		</div>
	);
};

// A single run block: an object-kind glyph chip + label + status badge.
export const RunBlock: React.FC<{
	kind: ObjectKind;
	label: string;
	status: RunStatus;
	width: number;
	height: number;
	glow?: number; // 0..1 error/active glow
	glowColor?: string;
}> = ({kind, label, status, width, height, glow = 0, glowColor}) => {
	const spec = OBJECTS[kind];
	const Glyph = spec.Glyph;
	const borderColor = status === "failed" ? COLORS.error : status === "ok" ? spec.accent : COLORS.border1;
	const ring = glowColor ?? (status === "failed" ? COLORS.error : spec.accent);
	const ringHex = Math.round(glow * 90)
		.toString(16)
		.padStart(2, "0");
	return (
		<div
			style={{
				width,
				height,
				backgroundColor: COLORS.surface3,
				border: `1.5px solid ${borderColor}`,
				borderRadius: RADIUS.md,
				boxShadow: glow > 0 ? `0 0 0 6px ${ring}${ringHex}, ${SHADOW.subtle}` : SHADOW.subtle,
				boxSizing: "border-box",
				padding: 18,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
				<div
					style={{
						width: 48,
						height: 48,
						borderRadius: RADIUS.sm,
						backgroundColor: spec.accent,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Glyph size={24} color="#ffffff" />
				</div>
				<StatusBadge status={status} />
			</div>
			<div style={{...TYPE.label, fontSize: 26, color: COLORS.text}}>{label}</div>
		</div>
	);
};

// A row in the BlockInspector panel: dim label, value chip.
export const InspectRow: React.FC<{
	label: string;
	children: React.ReactNode;
	error?: boolean;
}> = ({label, children, error = false}) => (
	<div style={{display: "flex", alignItems: "center", gap: 28, paddingBlock: 4}}>
		<div
			style={{
				...TYPE.micro,
				color: COLORS.textMuted,
				textTransform: "uppercase",
				letterSpacing: 1.2,
				width: 200,
				flexShrink: 0,
			}}
		>
			{label}
		</div>
		<div
			style={{
				...TYPE.mono,
				fontSize: 26,
				color: error ? COLORS.error : COLORS.textBody,
				backgroundColor: error ? COLORS.error + "16" : COLORS.surface4,
				border: `1px solid ${error ? COLORS.error + "66" : COLORS.border1}`,
				borderRadius: RADIUS.sm,
				padding: "8px 18px",
				flex: 1,
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis",
			}}
		>
			{children}
		</div>
	</div>
);

// A titled checklist card: rows of questions that "check on" one per beat.
export const ChecklistCard: React.FC<{
	title: string;
	width: number;
	children: React.ReactNode;
}> = ({title, width, children}) => (
	<div
		style={{
			width,
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: RADIUS.lg,
			boxShadow: SHADOW.medium,
			boxSizing: "border-box",
			padding: 40,
		}}
	>
		<div style={{...TYPE.heading, color: COLORS.text, marginBottom: 28}}>{title}</div>
		<div style={{display: "flex", flexDirection: "column", gap: 18}}>{children}</div>
	</div>
);

// A single checklist row with an animatable check badge.
export const ChecklistRow: React.FC<{text: string; checked: number}> = ({text, checked}) => {
	const color = COLORS.accent;
	return (
		<div style={{display: "flex", alignItems: "center", gap: 22}}>
			<div
				style={{
					width: 36,
					height: 36,
					borderRadius: RADIUS.sm,
					border: `1.5px solid ${checked > 0.5 ? color : COLORS.border1}`,
					backgroundColor: checked > 0.5 ? color + "22" : "transparent",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<svg
					width={22}
					height={22}
					viewBox="0 0 24 24"
					fill="none"
					stroke={color}
					strokeWidth={3}
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{opacity: checked, strokeDasharray: 30, strokeDashoffset: 30 * (1 - checked)}}
				>
					<polyline points="5 13 10 18 19 6" />
				</svg>
			</div>
			<div style={{...TYPE.body, fontSize: 32, color: COLORS.textBody}}>{text}</div>
		</div>
	);
};

// A small labeled chip (used for failure-types and prompt chips).
export const Chip: React.FC<{
	text: string;
	accent?: string;
	width?: number;
	mono?: boolean;
}> = ({text, accent = COLORS.border1, width, mono = false}) => (
	<div
		style={{
			width,
			backgroundColor: COLORS.surface3,
			border: `1px solid ${accent}`,
			borderRadius: RADIUS.md,
			boxShadow: SHADOW.subtle,
			padding: "16px 24px",
			...(mono ? TYPE.mono : TYPE.label),
			fontSize: mono ? 26 : 28,
			color: COLORS.textBody,
			boxSizing: "border-box",
		}}
	>
		{text}
	</div>
);

// The RunTimeline: a horizontal row of RunBlocks joined by connector segments.
// Presentational — the caller passes per-block status/opacity/glow so scenes
// drive their own motion. Position via the parent's absolute container.
export const RunTimeline: React.FC<{
	statuses: RunStatus[];
	opacities?: number[]; // per-block opacity (default all 1)
	glows?: number[]; // per-block glow (default all 0)
	glowColors?: (string | undefined)[];
	connectorProgress?: number; // 0..1, how far the joining line is drawn
}> = ({statuses, opacities, glows, glowColors, connectorProgress = 1}) => {
	return (
		<div style={{display: "flex", alignItems: "center"}}>
			{RUN_STEPS.map((step, i) => (
				<React.Fragment key={step.label}>
					<div style={{opacity: opacities ? opacities[i] : 1}}>
						<RunBlock
							kind={step.kind}
							label={step.label}
							status={statuses[i]}
							width={RUN_BLOCK_W}
							height={RUN_BLOCK_H}
							glow={glows ? glows[i] : 0}
							glowColor={glowColors ? glowColors[i] : undefined}
						/>
					</div>
					{i < RUN_STEPS.length - 1 ? (
						<div style={{width: RUN_GAP, height: 2, position: "relative", flexShrink: 0}}>
							<div
								style={{
									position: "absolute",
									left: 0,
									top: 0,
									height: 2,
									width: `${connectorProgress * 100}%`,
									backgroundColor: COLORS.border1,
								}}
							/>
						</div>
					) : null}
				</React.Fragment>
			))}
		</div>
	);
};

// A data token — a small shaped pill that travels between blocks.
export const DataToken: React.FC<{label: string; color: string}> = ({label, color}) => (
	<div
		style={{
			...TYPE.mono,
			fontSize: 26,
			color,
			backgroundColor: color + "1c",
			border: `1.5px solid ${color}`,
			borderRadius: RADIUS.sm,
			padding: "10px 20px",
			whiteSpace: "nowrap",
		}}
	>
		{label}
	</div>
);
