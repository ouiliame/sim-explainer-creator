import React from "react";
import {COLORS} from "../../../theme";
import {CARD_W, CARD_X, CARD_Y} from "../layout";
import {ITEMS, LOOP_COLOR, RepeatGlyph} from "./_rig";

// The product's subflow editor, as the zoom-aside card (scene 2). Content
// is verbatim from the staging editor + its own teaching screenshot
// (loop-2.png): header chip + name, "Loop Type" → "For Each"
// (subflow-editor.tsx:128, use-subflow-editor.ts:26), "Collection Items"
// (subflow-editor.tsx:159) → the authored collection. The dashed divider
// between the type and its value mirrors the real panel.

const S = 1.5;
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			fontFamily: FONT,
			fontSize: 13 * S,
			color: COLORS.textTertiary,
			marginBottom: 8,
		}}
	>
		{children}
	</div>
);

/** Editor card for the Loop container. itemGlows: 0..1 per collection item. */
export const ConfigCard: React.FC<{
	opacity: number;
	slide: number; // 0 = in place, 1 = offscreen-right offset
	itemGlows?: [number, number, number];
	typeGlow?: number;
}> = ({opacity, slide, itemGlows = [0, 0, 0], typeGlow = 0}) => {
	if (opacity <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: CARD_X + 80 * slide,
				top: CARD_Y,
				width: CARD_W,
				opacity,
				backgroundColor: COLORS.surface1,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: 8 * S,
				boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
				overflow: "hidden",
			}}
		>
			{/* Header — chip + block name, like the panel's title row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10 * S,
					padding: `${8 * S}px ${12 * S}px`,
					borderBottom: `1px solid ${COLORS.border1}`,
					backgroundColor: COLORS.surface3,
				}}
			>
				<div
					style={{
						width: 24 * S,
						height: 24 * S,
						borderRadius: 6 * S,
						background: LOOP_COLOR,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<RepeatGlyph size={16 * S} color="white" />
				</div>
				<span style={{fontFamily: FONT, fontWeight: 500, fontSize: 16 * S, color: COLORS.text}}>
					Loop
				</span>
			</div>

			<div style={{padding: `${14 * S}px ${12 * S}px ${16 * S}px`}}>
				<Label>Loop Type</Label>
				<div
					style={{
						position: "relative",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: `${7 * S}px ${10 * S}px`,
						borderRadius: 6 * S,
						border: `1px solid ${COLORS.border1}`,
						backgroundColor: COLORS.surface4,
					}}
				>
					<span style={{fontFamily: FONT, fontSize: 14 * S, color: COLORS.text}}>For Each</span>
					{/* chevron */}
					<svg width={16} height={16} viewBox="0 0 24 24" fill="none">
						<path
							d="m6 9 6 6 6-6"
							stroke={COLORS.textTertiary}
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{typeGlow > 0 ? (
						<div
							style={{
								position: "absolute",
								inset: 0,
								borderRadius: 6 * S,
								boxShadow: `inset 0 0 0 2px ${COLORS.secondary}`,
								opacity: typeGlow,
							}}
						/>
					) : null}
				</div>

				{/* Dashed separator, like the real panel */}
				<div
					style={{
						borderTop: `1px dashed ${COLORS.border1}`,
						margin: `${14 * S}px 0`,
					}}
				/>

				<Label>Collection Items</Label>
				<div
					style={{
						padding: `${10 * S}px ${10 * S}px`,
						borderRadius: 6 * S,
						border: `1px solid ${COLORS.border1}`,
						backgroundColor: COLORS.surface4,
						fontFamily: MONO,
						fontSize: 14 * S,
						color: COLORS.text,
						minHeight: 60 * S,
					}}
				>
					{"["}
					{ITEMS.map((item, i) => (
						<React.Fragment key={item}>
							{i > 0 ? ", " : ""}
							<span
								style={{
									borderRadius: 4,
									padding: "0 3px",
									margin: "0 -3px",
									backgroundColor: `rgba(51, 180, 255, ${0.22 * itemGlows[i]})`,
								}}
							>
								{item}
							</span>
						</React.Fragment>
					))}
					{"]"}
				</div>
			</div>
		</div>
	);
};
