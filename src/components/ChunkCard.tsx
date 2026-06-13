import React from "react";
import {COLORS, RADIUS, TYPE} from "../theme";
import type {DocKind} from "./DocumentCard";

const SOURCE_COLOR: Record<DocKind, string> = {
	pdf: COLORS.docPdf,
	md: COLORS.docMd,
	xls: COLORS.docXls,
	ntn: COLORS.docNotion,
	slide: COLORS.docSlide,
	mail: COLORS.docMail,
	drive: COLORS.docDrive,
	txt: COLORS.docTxt,
};

type Props = {
	lines?: number;
	width?: number;
	seed?: number;
	source?: DocKind;
	label?: string;
};

export const ChunkCard: React.FC<Props> = ({
	lines = 3,
	width = 220,
	seed = 0,
	source,
	label,
}) => {
	const stripeColor = source ? SOURCE_COLOR[source] : null;
	return (
		<div
			style={{
				width,
				padding: 10,
				paddingLeft: stripeColor ? 14 : 10,
				backgroundColor: COLORS.surface4,
				border: `1px solid ${COLORS.border}`,
				borderRadius: RADIUS.sm,
				display: "flex",
				flexDirection: "column",
				gap: 6,
				boxSizing: "border-box",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{stripeColor ? (
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						bottom: 0,
						width: 3,
						backgroundColor: stripeColor,
					}}
				/>
			) : null}
			{label ? (
				<div
					style={{
						...TYPE.micro,
						color: stripeColor ?? COLORS.textMuted,
						marginBottom: 2,
					}}
				>
					{label}
				</div>
			) : null}
			{Array.from({length: lines}).map((_, i) => {
				const widthPct = 92 - ((seed * 7 + i * 13) % 28);
				return (
					<div
						key={i}
						style={{
							height: 5,
							borderRadius: 2,
							backgroundColor: COLORS.textMuted,
							opacity: 0.45,
							width: `${widthPct}%`,
						}}
					/>
				);
			})}
		</div>
	);
};
