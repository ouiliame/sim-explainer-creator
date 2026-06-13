import React from "react";
import {COLORS, RADIUS, SPACING, TYPE} from "../theme";

export type DocKind = "pdf" | "md" | "xls" | "ntn" | "slide" | "mail" | "drive" | "txt";

const KIND_LABEL: Record<DocKind, string> = {
	pdf: "PDF",
	md: "MD",
	xls: "XLS",
	ntn: "NTN",
	slide: "SLD",
	mail: "MAIL",
	drive: "DRIVE",
	txt: "TXT",
};

const KIND_COLOR: Record<DocKind, string> = {
	pdf: COLORS.docPdf,
	md: COLORS.docMd,
	xls: COLORS.docXls,
	ntn: COLORS.docNotion,
	slide: COLORS.docSlide,
	mail: COLORS.docMail,
	drive: COLORS.docDrive,
	txt: COLORS.docTxt,
};

type Size = "sm" | "md" | "lg";

type Props = {
	kind: DocKind;
	name: string;
	size?: Size;
	connector?: string;
	width?: number;
};

const SIZES: Record<Size, {h: number; iconW: number; iconH: number; iconFS: number; nameFS: number; connFS: number}> = {
	sm: {h: 56, iconW: 36, iconH: 40, iconFS: 13, nameFS: 18, connFS: 14},
	md: {h: 76, iconW: 50, iconH: 56, iconFS: 15, nameFS: 22, connFS: 15},
	lg: {h: 96, iconW: 64, iconH: 72, iconFS: 17, nameFS: 28, connFS: 17},
};

export const DocumentCard: React.FC<Props> = ({kind, name, size = "md", connector, width}) => {
	const s = SIZES[size];
	const color = KIND_COLOR[kind];
	return (
		<div
			style={{
				width: width ?? "100%",
				height: s.h,
				backgroundColor: COLORS.surface4,
				border: `1px solid ${COLORS.border}`,
				borderRadius: RADIUS.sm,
				padding: 12,
				display: "flex",
				alignItems: "center",
				gap: SPACING.sm,
				boxSizing: "border-box",
			}}
		>
			<div
				style={{
					width: s.iconW,
					height: s.iconH,
					backgroundColor: color + "1f",
					border: `1px solid ${color}66`,
					borderRadius: RADIUS.xs,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
				}}
			>
				<div
					style={{
						...TYPE.micro,
						fontSize: s.iconFS,
						fontWeight: 700,
						color,
					}}
				>
					{KIND_LABEL[kind]}
				</div>
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 4,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						fontSize: s.nameFS,
						color: COLORS.text,
						fontFamily: TYPE.body.fontFamily,
						fontWeight: 500,
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{name}
				</div>
				{connector ? (
					<div
						style={{
							...TYPE.micro,
							fontSize: s.connFS,
							color: COLORS.textMuted,
						}}
					>
						via {connector}
					</div>
				) : null}
			</div>
		</div>
	);
};
