import React from "react";
import {interpolateColors} from "remotion";
import {COLORS, RADIUS, SHADOW, TYPE} from "../../../theme";
import {GmailGlyphFull, ObjectNode, ResolvedTag, SimBlock, SimEdgePath} from "../../../components";
import {BoundaryFrame, Gate, KeyGlyph} from "../scenes/_local";
import {
	ACCOUNT_REL_X,
	ACCOUNT_TEXT,
	ACCOUNT_Y,
	CRED_EDGE_FROM,
	CRED_POS,
	credEdgeTo,
	MEMBER_REL_X,
	MEMBER_RING_Y,
	MEMBER_SIZE,
	PANEL_H,
	PANEL_W,
	PANEL_Y,
	PORT_D,
	PORT_Y,
	SERVICE_H,
	SERVICE_W,
	SERVICE_X,
	SERVICES,
	serviceTop,
	STAGE_H,
	STAGE_W,
	TARGET_POS,
	TILE_H,
	TILE_W,
	TILES,
	WORKSPACE_LABEL,
} from "../layout-v2";

// ─────────────────────────────────────────────────────────────────────────────
// v2 set-piece vocabulary. The panel + everything attached to it is ONE
// component (WorkspacePanel) driven entirely by numeric state props; scenes
// own no geometry. Brand glyphs are ported verbatim from the product
// (`apps/sim/components/icons.tsx`, `apps/docs/components/icons.tsx`).
// ─────────────────────────────────────────────────────────────────────────────

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Clamped 0→1 ramp over [lo, hi] seconds, with optional theme easing. */
export const ramp = (t: number, lo: number, hi: number, easing?: (v: number) => number) => {
	const v = clamp01((t - lo) / (hi - lo));
	return easing ? easing(v) : v;
};

/** One up-and-down pulse over [lo, hi]: returns phase 0..1..0 → feed pulseScale/ring. */
export const pulse01 = (t: number, lo: number, hi: number) => {
	const v = clamp01((t - lo) / (hi - lo));
	return v <= 0 || v >= 1 ? 0 : Math.sin(Math.PI * v);
};
// "Changed / accessible" cue: a brief scale bump. p is the bump AMOUNT 0..1
// (feed it pulse01's sine output), not a phase.
const pulseScale = (p: number) => 1 + 0.05 * clamp01(p);
const dimOp = (dim: number) => 1 - 0.65 * clamp01(dim);

// ── Brand glyphs (multicolor, on white chips — the docs example's bgColor) ──

export const GoogleDriveGlyph: React.FC<{size?: number}> = ({size = 28}) => (
	<svg width={size} height={(size * 78) / 87.3} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
		<path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
		<path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
		<path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 11.5z" fill="#ea4335" />
		<path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
		<path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
		<path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
	</svg>
);

export const GoogleCalendarGlyph: React.FC<{size?: number}> = ({size = 28}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<g transform="translate(3.75 3.75)">
			<path fill="#FFFFFF" d="M148.88,43.62l-47.37-5.26l-57.89,5.26L38.35,96.25l5.26,52.63l52.63,6.58l52.63-6.58 l5.26-53.95L148.88,43.62z" />
			<path
				fill="#1A73E8"
				d="M65.21,125.28c-3.93-2.66-6.66-6.54-8.14-11.67l9.13-3.76c0.83,3.16,2.28,5.61,4.34,7.34 c2.05,1.74,4.55,2.59,7.47,2.59c2.99,0,5.55-0.91,7.7-2.72s3.22-4.13,3.22-6.93c0-2.87-1.13-5.21-3.39-7.03 s-5.11-2.72-8.5-2.72h-5.28v-9.04H76.5c2.92,0,5.38-0.79,7.38-2.37c2-1.58,3-3.74,3-6.49 c0-2.45-0.89-4.39-2.68-5.85s-4.05-2.2-6.8-2.2c-2.68,0-4.82,0.71-6.39,2.15s-2.72,3.2-3.45,5.28 l-9.04-3.76c1.2-3.39,3.4-6.39,6.62-8.99c3.22-2.59,7.34-3.89,12.34-3.89c3.7,0,7.03,0.71,9.97,2.15 c2.95,1.43,5.26,3.42,6.93,5.95c1.67,2.54,2.5,5.38,2.5,8.54c0,3.22-0.78,5.95-2.33,8.18 c-1.55,2.24-3.46,3.95-5.72,5.15v0.54c2.99,1.25,5.42,3.16,7.34,5.72c1.91,2.57,2.87,5.63,2.87,9.21 s-0.91,6.78-2.72,9.58c-1.82,2.8-4.33,5.01-7.51,6.62c-3.2,1.61-6.79,2.42-10.78,2.42 C73.41,129.26,69.15,127.93,65.21,125.28z"
			/>
			<path fill="#1A73E8" d="M121.25,79.96l-9.97,7.25l-5.01-7.6l17.99-12.97h6.9v61.2h-9.89L121.25,79.96z" />
			<path fill="#EA4335" d="M148.88,196.25l47.37-47.37l-23.68-10.53l-23.68,10.53l-10.53,23.68L148.88,196.25z" />
			<path fill="#34A853" d="M33.09,172.57l10.53,23.68h105.26v-47.37H43.62L33.09,172.57z" />
			<path fill="#4285F4" d="M12.04-3.75C3.32-3.75-3.75,3.32-3.75,12.04v136.84l23.68,10.53l23.68-10.53V43.62h105.26 l10.53-23.68L148.88-3.75H12.04z" />
			<path fill="#188038" d="M-3.75,148.88v31.58c0,8.72,7.07,15.79,15.79,15.79h31.58v-47.37H-3.75z" />
			<path fill="#FBBC04" d="M148.88,43.62v105.26h47.37V43.62l-23.68-10.53L148.88,43.62z" />
			<path fill="#1967D2" d="M196.25,43.62V12.04c0-8.72-7.07-15.79-15.79-15.79h-31.58v47.37H196.25z" />
		</g>
	</svg>
);

// The Credential block's header glyph — docs `CredentialIcon`, white stroke.
export const CredentialGlyphW: React.FC<{size?: number}> = ({size = 24}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="15" r="4" stroke="#ffffff" strokeWidth="1.75" />
		<path d="M11.83 13.17L20 5" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" />
		<path d="M18 7l2 2" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M15 10l2 2" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

// ── A member: neutral identity chip docked on the boundary ring ─────────────

export const PersonDot: React.FC<{size?: number; ring?: number; opacity?: number}> = ({
	size = MEMBER_SIZE,
	ring = 0,
	opacity = 1,
}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: 999,
			backgroundColor: "#505050",
			border: "1.5px solid #3d3d3d",
			boxShadow: `0 0 0 5px ${COLORS.bg}`,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			opacity,
			position: "relative",
		}}
	>
		<svg
			width={size * 0.55}
			height={size * 0.55}
			viewBox="0 0 24 24"
			fill="none"
			stroke="#ffffff"
			strokeWidth={1.9}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="8" r="3.6" />
			<path d="M5 20 a7 7 0 0 1 14 0" />
		</svg>
		{ring > 0 ? (
			<div
				style={{
					position: "absolute",
					inset: -1.5,
					borderRadius: 999,
					boxShadow: `0 0 0 2.5px ${COLORS.secondary}`,
					opacity: ring,
				}}
			/>
		) : null}
	</div>
);

// ── External service tile (white chip + multicolor brand glyph) ─────────────

const SERVICE_SPEC: Record<string, {label: string; Glyph: React.FC<{size?: number}>}> = {
	gmail: {label: "Gmail", Glyph: GmailGlyphFull},
	drive: {label: "Drive", Glyph: GoogleDriveGlyph},
	calendar: {label: "Calendar", Glyph: GoogleCalendarGlyph},
};

export const ServiceTile: React.FC<{id: string; dim?: number; ring?: number}> = ({
	id,
	dim = 0,
	ring = 0,
}) => {
	const {label, Glyph} = SERVICE_SPEC[id];
	return (
		<div
			style={{
				width: SERVICE_W,
				height: SERVICE_H,
				boxSizing: "border-box",
				backgroundColor: "#232323",
				border: "1px solid #3d3d3d",
				borderRadius: RADIUS.md,
				boxShadow: SHADOW.subtle,
				display: "flex",
				alignItems: "center",
				gap: 18,
				padding: "0 24px",
				opacity: dimOp(dim),
				position: "relative",
			}}
		>
			<div
				style={{
					width: 52,
					height: 52,
					borderRadius: 10,
					backgroundColor: "#FFFFFF",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<Glyph size={30} />
			</div>
			<div style={{...TYPE.label, fontSize: 26, color: COLORS.text, whiteSpace: "nowrap"}}>{label}</div>
			{ring > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: RADIUS.md,
						boxShadow: `inset 0 0 0 2.5px ${COLORS.secondary}`,
						opacity: ring,
					}}
				/>
			) : null}
		</div>
	);
};

// ── The set piece ────────────────────────────────────────────────────────────

export type MemberVis = {
	/** 0..1 entrance — slides down from above onto the ring; ≤0 renders nothing. */
	drop?: number;
	/** 0..1 selection-ring pulse opacity (just joined). */
	ring?: number;
};

export type PanelState = {
	x: number;
	opacity?: number;
	/** Per-tile entrance opacity (scene 1). */
	tileOp?: number[];
	/** Per-tile access-sweep pulse phase 0..1. */
	tilePulse?: number[];
	/** Per-tile dim 0..1 (0.35-opacity product language at 1). */
	tileDim?: number[];
	/** Dims the panel chrome — border, label, members, port, account (scene 5). */
	chromeDim?: number;
	members?: MemberVis[];
	/** The padlock port on the right edge. Absent until scene 4 introduces it. */
	port?: {presence: number; open: number; glow?: number};
	/** The held account identity, inside the panel beside the port. */
	accountOp?: number;
};

export const WorkspacePanel: React.FC<PanelState> = ({
	x,
	opacity = 1,
	tileOp,
	tilePulse,
	tileDim,
	chromeDim = 0,
	members = [],
	port,
	accountOp = 0,
}) => {
	if (opacity <= 0) return null;
	const chromeOp = dimOp(chromeDim);
	return (
		<div style={{position: "absolute", left: 0, top: 0, opacity}}>
			{/* Boundary frame (chrome) */}
			<div style={{position: "absolute", left: x, top: PANEL_Y, opacity: chromeOp}}>
				<BoundaryFrame label={WORKSPACE_LABEL} width={PANEL_W} height={PANEL_H} />
			</div>

			{/* Object tiles */}
			{TILES.map((tile, i) => {
				const op = clamp01(tileOp?.[i] ?? 1) * dimOp(tileDim?.[i] ?? 0);
				if (op <= 0) return null;
				return (
					<div
						key={tile.kind}
						style={{
							position: "absolute",
							left: x + tile.relX,
							top: PANEL_Y + tile.relY,
							opacity: op,
							transform: `scale(${pulseScale(tilePulse?.[i] ?? 0)})`,
						}}
					>
						<ObjectNode kind={tile.kind} width={TILE_W} height={TILE_H} />
					</div>
				);
			})}

			{/* Members docked on the ring */}
			{members.map((m, i) => {
				const drop = clamp01(m.drop ?? 0);
				if (drop <= 0) return null;
				const y = MEMBER_RING_Y - 140 * (1 - drop);
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: x + MEMBER_REL_X[i] - MEMBER_SIZE / 2,
							top: y - MEMBER_SIZE / 2,
							opacity: drop * chromeOp,
						}}
					>
						<PersonDot ring={m.ring ?? 0} />
					</div>
				);
			})}

			{/* Padlock port on the right edge */}
			{port && port.presence > 0 ? (
				<div
					style={{
						position: "absolute",
						left: x + PANEL_W - PORT_D / 2,
						top: PORT_Y - PORT_D / 2,
						opacity: clamp01(port.presence) * chromeOp,
						transform: `scale(${0.8 + 0.2 * clamp01(port.presence)})`,
					}}
				>
					<Gate open={port.open} height={PORT_D} />
					{(port.glow ?? 0) > 0 ? (
						<div
							style={{
								position: "absolute",
								inset: -4,
								borderRadius: 999,
								boxShadow: `0 0 0 2.5px ${COLORS.success}, 0 0 28px ${COLORS.success}66`,
								opacity: port.glow,
							}}
						/>
					) : null}
				</div>
			) : null}

			{/* Held account identity (inside, beside the port) */}
			{accountOp > 0 ? (
				<div
					style={{
						position: "absolute",
						left: x + ACCOUNT_REL_X - 150,
						top: ACCOUNT_Y - 16,
						width: 300,
						textAlign: "center",
						...TYPE.label,
						fontSize: 20,
						color: COLORS.textSecondary,
						opacity: accountOp * chromeOp,
					}}
				>
					{ACCOUNT_TEXT}
				</div>
			) : null}
		</div>
	);
};

// ── Connection lines from the port to the services ──────────────────────────

export const PortLines: React.FC<{panelX: number; progress: number[]; opacity?: number}> = ({
	panelX,
	progress,
	opacity = 1,
}) => {
	if (opacity <= 0) return null;
	const x1 = panelX + PANEL_W + PORT_D / 2;
	return (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
		>
			{SERVICES.map((id, i) => {
				const p = clamp01(progress[i] ?? 0);
				if (p <= 0) return null;
				const y2 = serviceTop(i) + SERVICE_H / 2;
				const x2 = SERVICE_X;
				return (
					<line
						key={id}
						x1={x1}
						y1={PORT_Y}
						x2={x1 + (x2 - x1) * p}
						y2={PORT_Y + (y2 - PORT_Y) * p}
						stroke="#454545"
						strokeWidth={2.25}
					/>
				);
			})}
		</svg>
	);
};

// ── The Google account key (scene 4 — absorbed by the port) ─────────────────

export const AccountKey: React.FC<{x: number; y: number; opacity?: number; scale?: number}> = ({
	x,
	y,
	opacity = 1,
	scale = 1,
}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			transform: `translate(-50%, -50%) scale(${scale})`,
			opacity,
			display: "flex",
			alignItems: "center",
			gap: 14,
			padding: "14px 22px",
			backgroundColor: "#232323",
			border: "1px solid #3d3d3d",
			borderRadius: RADIUS.md,
			boxShadow: SHADOW.medium,
		}}
	>
		<div
			style={{
				width: 44,
				height: 44,
				borderRadius: 9,
				backgroundColor: COLORS.warning,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			<KeyGlyph size={26} color="#ffffff" />
		</div>
		<div style={{...TYPE.label, fontSize: 24, color: COLORS.text, whiteSpace: "nowrap"}}>Google</div>
	</div>
);

// ── The blocked reach (scene 3) ──────────────────────────────────────────────

export const ReachLine: React.FC<{
	from: {x: number; y: number};
	toward: {x: number; y: number};
	stopX: number;
	progress: number;
	blocked: number;
	opacity?: number;
}> = ({from, toward, stopX, progress, blocked, opacity = 1}) => {
	if (progress <= 0 || opacity <= 0) return null;
	// The visible segment runs from the workflow toward the target but ends at
	// the boundary; progress 0..1 draws toward that stop point.
	const tStop = (from.x - stopX) / (from.x - toward.x);
	const end = {
		x: from.x + (toward.x - from.x) * tStop,
		y: from.y + (toward.y - from.y) * tStop,
	};
	const cur = {
		x: from.x + (end.x - from.x) * progress,
		y: from.y + (end.y - from.y) * progress,
	};
	const stroke = interpolateColors(clamp01(blocked), [0, 1], ["#454545", "#ef4444"]);
	return (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
		>
			<line x1={from.x} y1={from.y} x2={cur.x} y2={cur.y} stroke={stroke} strokeWidth={2.5} />
		</svg>
	);
};

export const XStamp: React.FC<{x: number; y: number; presence: number}> = ({x, y, presence}) => {
	if (presence <= 0) return null;
	const s = 0.6 + 0.4 * clamp01(presence);
	return (
		<div
			style={{
				position: "absolute",
				left: x - 24,
				top: y - 24,
				width: 48,
				height: 48,
				borderRadius: 999,
				backgroundColor: "#232323",
				border: "1.5px solid #ef4444",
				boxShadow: `0 0 0 5px ${COLORS.bg}, 0 0 24px rgba(239,68,68,0.45)`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				opacity: clamp01(presence),
				transform: `scale(${s})`,
			}}
		>
			<svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2.6} strokeLinecap="round">
				<path d="M6 6 L18 18" />
				<path d="M18 6 L6 18" />
			</svg>
		</div>
	);
};

// ── The connected world at rest (scene-4 exit = scene-5/6 outer world) ──────

export const RestWorld: React.FC<{
	panelX: number;
	opacity?: number;
	/** Dims everything except the Workflow tile (the zoom focal). */
	dimExceptWorkflow?: number;
	servicesOp?: number;
	tilePulse?: number[];
	memberRing?: number;
	portGlow?: number;
}> = ({
	panelX,
	opacity = 1,
	dimExceptWorkflow = 0,
	servicesOp = 1,
	tilePulse,
	memberRing = 0,
	portGlow = 0,
}) => {
	if (opacity <= 0) return null;
	const d = clamp01(dimExceptWorkflow);
	return (
		<div style={{position: "absolute", inset: 0, opacity}}>
			{servicesOp > 0 ? (
				<>
					<PortLines panelX={panelX} progress={[1, 1, 1]} opacity={servicesOp * dimOp(d)} />
					{SERVICES.map((id, i) => (
						<div
							key={id}
							style={{
								position: "absolute",
								left: SERVICE_X,
								top: serviceTop(i),
								opacity: servicesOp * dimOp(d),
							}}
						>
							<ServiceTile id={id} />
						</div>
					))}
				</>
			) : null}
			<WorkspacePanel
				x={panelX}
				members={[{drop: 1, ring: memberRing}, {drop: 1, ring: memberRing}, {drop: 1, ring: memberRing}]}
				tileDim={[0, d, d, d]}
				tilePulse={tilePulse}
				chromeDim={d}
				port={{presence: 1, open: 1, glow: portGlow}}
				accountOp={1}
			/>
		</div>
	);
};

// ── Scene 5 canvas: the docs' credential-share workflow, ×1.5 ───────────────

export type CredChainState = {
	blockOp?: number[]; // credential, gmail, drive, calendar
	rise?: number[]; // 0..1 settle per block
	edge?: number[]; // draw progress per edge
	credHi?: boolean;
	targetHi?: boolean[];
	/** Glowing-dot travel per edge (0..1) — the wires bend, so the sanctioned
	 *  dot carries the pulse (module-1 spokes precedent). */
	dotP?: number[];
	tagGlow?: number;
	resolve?: number;
};

const TARGETS: {name: string; Glyph: React.FC<{size?: number}>}[] = [
	{name: "Gmail", Glyph: GmailGlyphFull},
	{name: "Drive", Glyph: GoogleDriveGlyph},
	{name: "Calendar", Glyph: GoogleCalendarGlyph},
];

// Position along the smooth-step path (H → V → H), by arc fraction.
const dotPos = (i: number, p: number) => {
	const a = CRED_EDGE_FROM;
	const b = credEdgeTo(i);
	const midX = (a.x + b.x) / 2;
	const l1 = Math.abs(midX - a.x);
	const l2 = Math.abs(b.y - a.y);
	const l3 = Math.abs(b.x - midX);
	const L = l1 + l2 + l3;
	const d = p * L;
	if (d <= l1) return {x: a.x + Math.sign(midX - a.x) * d, y: a.y};
	if (d <= l1 + l2) return {x: midX, y: a.y + Math.sign(b.y - a.y) * (d - l1)};
	return {x: midX + Math.sign(b.x - midX) * (d - l1 - l2), y: b.y};
};

export const CredChain: React.FC<CredChainState> = ({
	blockOp = [1, 1, 1, 1],
	rise = [1, 1, 1, 1],
	edge = [1, 1, 1],
	credHi = false,
	targetHi = [false, false, false],
	dotP = [0, 0, 0],
	tagGlow = 0,
	resolve = 0,
}) => {
	return (
		<>
			{/* Edges */}
			<svg
				width={STAGE_W}
				height={STAGE_H}
				viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
				style={{position: "absolute", inset: 0, pointerEvents: "none"}}
			>
				{TARGETS.map((t, i) => (
					<SimEdgePath
						key={t.name}
						x1={CRED_EDGE_FROM.x}
						y1={CRED_EDGE_FROM.y}
						x2={credEdgeTo(i).x}
						y2={credEdgeTo(i).y}
						progress={edge[i] ?? 0}
					/>
				))}
			</svg>

			{/* Credential block (docs rows, verbatim) */}
			{(blockOp[0] ?? 0) > 0 ? (
				<div
					style={{
						position: "absolute",
						left: CRED_POS.x,
						top: CRED_POS.y + 14 * (1 - (rise[0] ?? 1)),
						opacity: blockOp[0],
					}}
				>
					<SimBlock
						name="Credential"
						color="#6366F1"
						glyph={<CredentialGlyphW size={22} />}
						rows={[
							{title: "Operation", value: "Select Credential"},
							{title: "Account", value: "Google"},
						]}
						hideTargetHandle
						highlighted={credHi}
					/>
				</div>
			) : null}

			{/* Gmail / Drive / Calendar (white chips, multicolor glyphs) */}
			{TARGETS.map((t, i) => {
				const op = blockOp[i + 1] ?? 0;
				if (op <= 0) return null;
				return (
					<div
						key={t.name}
						style={{
							position: "absolute",
							left: TARGET_POS[i].x,
							top: TARGET_POS[i].y + 14 * (1 - (rise[i + 1] ?? 1)),
							opacity: op,
						}}
					>
						<SimBlock
							name={t.name}
							color="#FFFFFF"
							glyph={<t.Glyph size={22} />}
							rows={[
								{
									title: "Account",
									value: (
										<ResolvedTag
											tag="<credential.credentialId>"
											value={ACCOUNT_TEXT}
											glow={tagGlow}
											resolve={resolve}
										/>
									),
								},
							]}
							hideSourceHandle
							highlighted={targetHi[i] ?? false}
						/>
					</div>
				);
			})}

			{/* Glowing dots on the wires */}
			{TARGETS.map((t, i) => {
				const p = dotP[i] ?? 0;
				if (p <= 0 || p >= 1) return null;
				// Absorbed before reaching the destination handle.
				const op = p < 0.12 ? p / 0.12 : p > 0.78 ? Math.max(0, (0.92 - p) / 0.14) : 1;
				if (op <= 0) return null;
				const pos = dotPos(i, p);
				return (
					<div
						key={t.name}
						style={{
							position: "absolute",
							left: pos.x - 5,
							top: pos.y - 5,
							width: 10,
							height: 10,
							borderRadius: 99,
							backgroundColor: COLORS.secondary,
							boxShadow: "0 0 12px rgba(51,180,255,0.8)",
							opacity: op,
						}}
					/>
				);
			})}
		</>
	);
};
