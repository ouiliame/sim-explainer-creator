import React from "react";
import {COLORS} from "../theme";

// The "spins up a fresh chat" aside, promoted from module-5 v3 once it proved
// out. Styling mirrors Sim's real chat (apps/sim/app/chat/components/message):
// user messages are right-aligned rounded-3xl bubbles on #2a2a2a
// (--landing-bg-elevated); assistant turns are plain left text; tool calls
// render in the established chip grammar.
//
// Content is a parameterized item list so any video can stage any
// conversation. Every item carries its own frame-derived `reveal` (0..1);
// rows rise in as they reveal. Pass `phase` (e.g. t*0.9) for the pulsing
// thinking/status dots.

const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

export type ChatItem =
	| {kind: "user"; content: React.ReactNode; reveal?: number}
	| {kind: "thinking"; reveal?: number}
	| {
			kind: "tool";
			name: string;
			color: string;
			glyph?: React.ReactNode;
			detail?: string;
			/** 0 = running (pulsing dot), 1 = done (green check) */
			done?: number;
			reveal?: number;
	  }
	| {kind: "result"; text?: string; content?: React.ReactNode; reveal?: number}
	| {kind: "assistant"; content: React.ReactNode; reveal?: number};

const rowFade = (r: number): React.CSSProperties => ({
	opacity: r,
	transform: `translateY(${(1 - Math.min(1, r)) * 10}px)`,
});

const ThinkingDots: React.FC<{phase: number; opacity: number}> = ({phase, opacity}) => (
	<div style={{display: "flex", gap: 7, alignItems: "center", height: 26, opacity}}>
		{[0, 1, 2].map((i) => (
			<div
				key={i}
				style={{
					width: 8,
					height: 8,
					borderRadius: 99,
					backgroundColor: COLORS.textMuted,
					opacity: 0.4 + 0.6 * Math.max(0, Math.sin(phase * Math.PI * 2 - i * 0.9)),
				}}
			/>
		))}
	</div>
);

type Props = {
	x: number;
	y: number;
	w?: number;
	minBodyH?: number;
	opacity?: number;
	/** 0..1 entrance — the panel rises slightly as it appears. */
	slide?: number;
	title?: string;
	/** Drives the pulsing dots (thinking + running tool status). */
	phase?: number;
	items: ChatItem[];
};

export const ChatPanel: React.FC<Props> = ({
	x,
	y,
	w = 580,
	minBodyH = 290,
	opacity = 1,
	slide = 1,
	title = "New chat",
	phase = 0,
	items,
}) => {
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y + (1 - slide) * 28,
				width: w,
				opacity,
				backgroundColor: COLORS.surface1,
				border: `1px solid ${COLORS.border}`,
				borderRadius: 14,
				boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					padding: "12px 18px",
					borderBottom: `1px solid ${COLORS.border}`,
					fontFamily: FONT,
					fontSize: 18,
					color: COLORS.textMuted,
				}}
			>
				{title}
			</div>

			<div
				style={{
					padding: 18,
					display: "flex",
					flexDirection: "column",
					gap: 14,
					minHeight: minBodyH,
				}}
			>
				{items.map((item, i) => {
					const r = item.reveal ?? 1;
					if (r <= 0) return null;

					if (item.kind === "user") {
						return (
							<div key={i} style={{display: "flex", justifyContent: "flex-end", ...rowFade(r)}}>
								<div
									style={{
										maxWidth: "85%",
										borderRadius: 24,
										backgroundColor: COLORS.chipBg,
										padding: "12px 18px",
										fontFamily: FONT,
										fontSize: 21,
										color: COLORS.text,
									}}
								>
									{item.content}
								</div>
							</div>
						);
					}
					if (item.kind === "thinking") {
						return <ThinkingDots key={i} phase={phase} opacity={r} />;
					}
					if (item.kind === "tool") {
						const done = item.done ?? 0;
						return (
							<div
								key={i}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									alignSelf: "flex-start",
									borderRadius: 9,
									border: `1px solid ${COLORS.border1}`,
									backgroundColor: COLORS.surface2,
									padding: "8px 14px",
									...rowFade(r),
								}}
							>
								<div
									style={{
										width: 26,
										height: 26,
										borderRadius: 6,
										backgroundColor: item.color,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{item.glyph}
								</div>
								<span style={{fontFamily: FONT, fontSize: 18, color: COLORS.text}}>{item.name}</span>
								{item.detail ? (
									<span style={{fontFamily: MONO, fontSize: 16, color: COLORS.textMuted}}>
										{item.detail}
									</span>
								) : null}
								{done < 0.5 ? (
									<div
										style={{
											width: 9,
											height: 9,
											borderRadius: 99,
											backgroundColor: COLORS.secondary,
											opacity: 0.4 + 0.6 * Math.max(0, Math.sin(phase * Math.PI * 2)),
										}}
									/>
								) : (
									<svg
										width={16}
										height={16}
										viewBox="0 0 24 24"
										fill="none"
										stroke="#22c55e"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								)}
							</div>
						);
					}
					if (item.kind === "result") {
						return (
							<div
								key={i}
								style={{
									fontFamily: FONT,
									fontSize: 17,
									color: COLORS.textMuted,
									paddingLeft: 8,
									...rowFade(r),
								}}
							>
								{item.content ?? item.text}
							</div>
						);
					}
					return (
						<div
							key={i}
							style={{fontFamily: FONT, fontSize: 21, color: COLORS.text, ...rowFade(r)}}
						>
							{item.content}
						</div>
					);
				})}
			</div>
		</div>
	);
};
