import React from "react";

// Column-type icons mirrored from Sim's emcn icon set (table-grid uses these).
// All render in a neutral tone — Sim deliberately uses no per-column color.
type P = {size?: number; color?: string};

const wrap = (size: number, color: string, children: React.ReactNode, vb = "-1.75 -1.5 24 24") => (
	<svg
		width={size}
		height={size}
		viewBox={vb}
		fill="none"
		stroke={color}
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		{children}
	</svg>
);

export const TypeTextIcon: React.FC<P> = ({size = 18, color = "currentColor"}) =>
	wrap(size, color, <><path d="M3.25 2.25H17.25" /><path d="M10.25 2.25V18.75" /><path d="M7.25 18.75H13.25" /></>);

export const TypeNumberIcon: React.FC<P> = ({size = 18, color = "currentColor"}) =>
	wrap(size, color, <><path d="M3.25 7.25H17.75" /><path d="M2.75 13.75H17.25" /><path d="M8.25 1.25L6.25 19.75" /><path d="M14.25 1.25L12.25 19.75" /></>);

export const TypeBooleanIcon: React.FC<P> = ({size = 18, color = "currentColor"}) =>
	wrap(size, color, <><rect x="2.5" y="2.75" width="15.5" height="15.5" rx="2.5" /><path d="M6.25 10.75L9.25 13.75L14.25 7.25" /></>);

export const TypeJsonIcon: React.FC<P> = ({size = 18, color = "currentColor"}) =>
	wrap(
		size,
		color,
		<>
			<path d="M5.75 1.25C3.54 1.25 1.75 3.04 1.75 5.25V7.75C1.75 9.13 0.63 10.25 -0.75 10.25C0.63 10.25 1.75 11.37 1.75 12.75V15.25C1.75 17.46 3.54 19.25 5.75 19.25" />
			<path d="M14.75 1.25C16.96 1.25 18.75 3.04 18.75 5.25V7.75C18.75 9.13 19.87 10.25 21.25 10.25C19.87 10.25 18.75 11.37 18.75 12.75V15.25C18.75 17.46 16.96 19.25 14.75 19.25" />
		</>,
		"-1.75 -1.75 24 24",
	);

export const TypeDateIcon: React.FC<P> = ({size = 18, color = "currentColor"}) =>
	wrap(
		size,
		color,
		<>
			<path d="M0.75 5.25C0.75 3.87 1.87 2.75 3.25 2.75H17.25C18.63 2.75 19.75 3.87 19.75 5.25V16.25C19.75 17.63 18.63 18.75 17.25 18.75H3.25C1.87 18.75 0.75 17.63 0.75 16.25V5.25Z" />
			<path d="M0.75 8.25H19.75" />
			<path d="M6.25 0.25V5.25" />
			<path d="M14.25 0.25V5.25" />
		</>,
	);

// Workflow-output column → a filled play glyph (Sim falls back to PlayOutline).
export const PlayGlyph: React.FC<P> = ({size = 16, color = "currentColor"}) => (
	<svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path
			d="M6.13 1.7C7.08 2.24 7.83 2.66 8.37 3.05C8.9 3.44 9.3 3.85 9.44 4.4C9.55 4.79 9.55 5.21 9.44 5.6C9.3 6.15 8.9 6.56 8.37 6.95C7.83 7.34 7.08 7.76 6.13 8.3C5.21 8.83 4.44 9.27 3.85 9.52C3.25 9.77 2.71 9.9 2.19 9.75C1.8 9.64 1.45 9.43 1.16 9.15C0.78 8.76 0.63 8.22 0.55 7.58C0.48 6.93 0.48 6.1 0.48 5.03V4.97C0.48 3.9 0.48 3.07 0.55 2.42C0.63 1.78 0.78 1.24 1.16 0.85C1.45 0.57 1.8 0.36 2.19 0.25C2.71 0.1 3.25 0.23 3.85 0.48C4.44 0.73 5.21 1.17 6.13 1.7Z"
			fill={color}
		/>
	</svg>
);

export const COLUMN_TYPE_ICON = {
	text: TypeTextIcon,
	number: TypeNumberIcon,
	boolean: TypeBooleanIcon,
	json: TypeJsonIcon,
	date: TypeDateIcon,
} as const;
