import React from "react";
import {COLORS, RADIUS, SHADOW, TYPE} from "../../../theme";

// ─────────────────────────────────────────────────────────────────────────────
// Local helpers for Module 8. These are video-specific shapes that aren't part
// of the shared toolkit: a neutral boundary box, an auth-key node, a role badge,
// a checklist card, member dots, external-service nodes, and person figures.
// Kept inside the video dir per project rules (no edits to src/components).
// ─────────────────────────────────────────────────────────────────────────────

// A neutral "system boundary" box. Just a labeled frame — everything else in a
// scene lives inside it. Accent defaults to brand; team boxes use a warmer tint.
export const BoundaryFrame: React.FC<{
	label?: string;
	width: number;
	height: number;
	accent?: string;
	dim?: number;
	children?: React.ReactNode;
}> = ({label = "my workspace", width, height, accent, dim = 1, children}) => (
	<div
		style={{
			width,
			height,
			boxSizing: "border-box",
			backgroundColor: COLORS.surface1,
			border: `1.5px solid ${accent ?? COLORS.border1}`,
			borderRadius: RADIUS.lg,
			boxShadow: SHADOW.overlay,
			opacity: dim,
			position: "relative",
		}}
	>
		<div
			style={{
				position: "absolute",
				top: 18,
				left: 24,
				...TYPE.label,
				fontSize: 22,
				color: COLORS.textMuted,
				whiteSpace: "nowrap",
			}}
		>
			{label}
		</div>
		{children}
	</div>
);

// A key glyph — the auth material that unlocks an integration.
const KeyGlyph: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.warning}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<circle cx="7.5" cy="7.5" r="4" />
		<path d="M10.3 10.3 L20 20" />
		<path d="M16.5 16.5 L19 14" />
		<path d="M14 14 L16.5 11.5" />
	</svg>
);

// A credential as a compact node. `scope` is a short noun shown beneath ("personal"/"workspace").
export const CredentialKey: React.FC<{
	label?: string;
	scope?: string;
	width?: number;
	height?: number;
	accent?: string;
}> = ({label = "credential", scope, width = 220, height = 92, accent = COLORS.warning}) => (
	<div
		style={{
			width,
			height,
			boxSizing: "border-box",
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: RADIUS.md,
			boxShadow: SHADOW.subtle,
			display: "flex",
			alignItems: "center",
			gap: 16,
			padding: "0 20px",
		}}
	>
		<div
			style={{
				width: 50,
				height: 50,
				borderRadius: 9,
				backgroundColor: accent,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			<KeyGlyph size={28} color="#ffffff" />
		</div>
		<div style={{display: "flex", flexDirection: "column", gap: 4, overflow: "hidden"}}>
			<div style={{...TYPE.label, fontSize: 24, color: COLORS.text, whiteSpace: "nowrap"}}>{label}</div>
			{scope ? (
				<div style={{...TYPE.micro, fontSize: 17, color: COLORS.textMuted, whiteSpace: "nowrap"}}>{scope}</div>
			) : null}
		</div>
	</div>
);

// A small member dot — a person in a workspace. Color encodes their role/group.
export const MemberDot: React.FC<{color?: string; size?: number; ring?: boolean}> = ({
	color = COLORS.secondary,
	size = 44,
	ring = false,
}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: 999,
			backgroundColor: color,
			border: "none",
			boxShadow: ring ? `0 0 0 4px ${color}44` : "none",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
		}}
	>
		<svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<circle cx="12" cy="8" r="3.6" />
			<path d="M5 20 a7 7 0 0 1 14 0" />
		</svg>
	</div>
);

// Role accent ramp — read=neutral, write=blue, admin=teal, owner=brand.
export const ROLE_ACCENT: Record<string, string> = {
	read: COLORS.textIcon,
	write: COLORS.secondary,
	admin: COLORS.knowledge,
	owner: COLORS.brand,
};

export const ROLE_LABEL: Record<string, string> = {
	read: "Read",
	write: "Write",
	admin: "Admin",
	owner: "Owner",
};

// A capability strip shown beside a role rung — short verbs, not sentences.
export const ROLE_CAPS: Record<string, string[]> = {
	read: ["view"],
	write: ["view", "build"],
	admin: ["view", "build", "manage"],
	owner: ["view", "build", "manage", "own"],
};

// A role rung: a badge + its capability chips.
export const RoleRung: React.FC<{
	role: string;
	width: number;
	height: number;
	accent: string;
}> = ({role, width, height, accent}) => (
	<div
		style={{
			width,
			height,
			boxSizing: "border-box",
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: RADIUS.md,
			boxShadow: SHADOW.subtle,
			display: "flex",
			alignItems: "center",
			padding: "0 28px",
			gap: 28,
		}}
	>
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 14,
				width: 220,
				flexShrink: 0,
			}}
		>
			<div
				style={{
					width: 18,
					height: 18,
					borderRadius: 999,
					backgroundColor: accent,
					boxShadow: `0 0 14px ${accent}88`,
				}}
			/>
			<div style={{...TYPE.heading, fontSize: 40, color: COLORS.text}}>{ROLE_LABEL[role]}</div>
		</div>
		<div style={{display: "flex", gap: 12, flexWrap: "wrap"}}>
			{ROLE_CAPS[role].map((cap) => (
				<div
					key={cap}
					style={{
						padding: "8px 18px",
						borderRadius: RADIUS.sm,
						backgroundColor: accent + "1c",
						border: `1px solid ${accent}55`,
						...TYPE.label,
						fontSize: 22,
						color: COLORS.textSecondary,
					}}
				>
					{cap}
				</div>
			))}
		</div>
	</div>
);

// A checklist card. Items reveal one at a time via the `revealed` count; a
// revealed item shows a green check, unrevealed ones a muted dot.
export const ChecklistCard: React.FC<{
	title?: string;
	items: readonly string[];
	revealed: number;
	width: number;
}> = ({title = "Handoff checklist", items, revealed, width}) => (
	<div
		style={{
			width,
			boxSizing: "border-box",
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: RADIUS.lg,
			boxShadow: SHADOW.overlay,
			padding: 36,
			display: "flex",
			flexDirection: "column",
			gap: 20,
		}}
	>
		<div style={{...TYPE.heading, fontSize: 40, color: COLORS.text, marginBottom: 4}}>{title}</div>
		{items.map((item, i) => {
			const on = i < revealed;
			return (
				<div key={item} style={{display: "flex", alignItems: "center", gap: 18, opacity: on ? 1 : 0.28}}>
					<div
						style={{
							width: 36,
							height: 36,
							borderRadius: RADIUS.sm,
							backgroundColor: on ? COLORS.accentSoft : COLORS.surface4,
							border: `1px solid ${on ? COLORS.accent : COLORS.border}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						{on ? (
							<svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
								<path d="M5 12.5 L10 17.5 L19 6.5" />
							</svg>
						) : null}
					</div>
					<div style={{...TYPE.body, fontSize: 30, color: on ? COLORS.text : COLORS.textMuted}}>{item}</div>
				</div>
			);
		})}
	</div>
);

// External service node (Slack / Google / API / DB) sitting outside the boundary.
const ServiceGlyph: React.FC<{kind: string; size: number}> = ({kind, size}) => {
	const c = "#ffffff";
	if (kind === "db") {
		return (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
				<path d="M5 5.5 V18.5 a7 2.8 0 0 0 14 0 V5.5" />
				<path d="M5 12 a7 2.8 0 0 0 14 0" />
			</svg>
		);
	}
	if (kind === "api") {
		return (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M9 7 L4.5 12 L9 17" />
				<path d="M15 7 L19.5 12 L15 17" />
			</svg>
		);
	}
	if (kind === "slack") {
		return (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<rect x="6.5" y="6.5" width="11" height="11" rx="3" />
				<path d="M10 4 V20" />
				<path d="M14 4 V20" />
			</svg>
		);
	}
	// google
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="7.5" />
			<path d="M12 4.5 V12 H19.5" />
		</svg>
	);
};

// Solid chip colors (real brand tones; Slack aubergine from Sim's landing data).
export const SERVICE_ACCENT: Record<string, string> = {
	slack: "#611f69",
	google: "#2563EB",
	api: "#6366F1",
	db: "#10B981",
};

export const SERVICE_LABEL: Record<string, string> = {
	slack: "Slack",
	google: "Google",
	api: "API",
	db: "Database",
};

export const ServiceNode: React.FC<{kind: string; width: number; height: number}> = ({kind, width, height}) => {
	const c = SERVICE_ACCENT[kind];
	return (
		<div
			style={{
				width,
				height,
				boxSizing: "border-box",
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: RADIUS.md,
				boxShadow: SHADOW.subtle,
				display: "flex",
				alignItems: "center",
				gap: 16,
				padding: "0 22px",
			}}
		>
			<div
				style={{
					width: 48,
					height: 48,
					borderRadius: 9,
					backgroundColor: c,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<ServiceGlyph kind={kind} size={26} />
			</div>
			<div style={{...TYPE.label, fontSize: 24, color: COLORS.text, whiteSpace: "nowrap"}}>{SERVICE_LABEL[kind]}</div>
		</div>
	);
};

// An auth port on the boundary: a solid circular node with a padlock. Closed =
// neutral card + lock in the given color. `open` (0→1) swings the shackle open
// and recolors the chip green. Centered on the given height for drop-in
// compatibility with the old gate's layout.
export const Gate: React.FC<{open: number; height?: number; color?: string}> = ({
	open,
	height = 200,
	color = COLORS.warning,
}) => {
	const D = 92; // port diameter
	const chip = open > 0.5 ? "#10B981" : color;
	// Shackle swings up-open as `open` goes 0→1.
	const swing = open * 38; // degrees
	return (
		<div style={{position: "relative", width: D, height, display: "flex", alignItems: "center", justifyContent: "center"}}>
			<div
				style={{
					width: D,
					height: D,
					borderRadius: 999,
					backgroundColor: COLORS.surface2,
					border: `1.5px solid ${COLORS.border1}`,
					boxShadow: `0 0 0 6px ${COLORS.bg}, 0 0 24px ${chip}44`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						width: 56,
						height: 56,
						borderRadius: 12,
						backgroundColor: chip,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						{/* body */}
						<rect x="5" y="11" width="14" height="9" rx="2" />
						{/* shackle — rotates open around its right foot */}
						<g transform={`rotate(${-swing} 16 11)`}>
							<path d="M8 11 V8 a4 4 0 0 1 8 0 v3" />
						</g>
					</svg>
				</div>
			</div>
		</div>
	);
};

// A person figure — "you" or "customer" — a head/shoulders silhouette + label.
export const PersonFigure: React.FC<{label: string; accent?: string; size?: number}> = ({
	label,
	accent = COLORS.textIcon,
	size = 120,
}) => (
	<div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				backgroundColor: accent + "26",
				border: `2px solid ${accent}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<circle cx="12" cy="8" r="3.8" />
				<path d="M4.5 20 a7.5 7.5 0 0 1 15 0" />
			</svg>
		</div>
		<div style={{...TYPE.label, fontSize: 26, color: COLORS.textSecondary}}>{label}</div>
	</div>
);

// A compact inside-the-box tile for a credential (mirrors ObjectNode tile look).
export const CredentialTile: React.FC<{width: number; height: number; accent?: string}> = ({
	width,
	height,
	accent = COLORS.warning,
}) => (
	<div
		style={{
			width,
			height,
			boxSizing: "border-box",
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: RADIUS.md,
			boxShadow: SHADOW.subtle,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: 14,
			padding: 18,
		}}
	>
		<div
			style={{
				width: 54,
				height: 54,
				borderRadius: 10,
				backgroundColor: accent,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<KeyGlyph size={30} color="#ffffff" />
		</div>
		<div style={{...TYPE.label, fontSize: 22, color: COLORS.text, whiteSpace: "nowrap"}}>Credential</div>
	</div>
);

export {KeyGlyph};
