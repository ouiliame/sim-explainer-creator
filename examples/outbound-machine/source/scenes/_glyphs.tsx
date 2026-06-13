import React from "react";

// Brand glyphs ported verbatim from the product (apps/sim/components/
// icons.tsx) for the GTM blocks this video draws. Provenance per glyph;
// fills match the product's chip-luminance rule (dark glyph on a light
// chip, white/colored glyph on a dark chip).

/** ApolloIcon (icons.tsx:4714) — black star-burst on the #EBF212 yellow
 *  chip (the product renders a dark glyph on a light chip). */
export const ApolloGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = "#000000",
}) => (
	<svg width={size} height={size} viewBox="0 0 36 36" fill={color} xmlns="http://www.w3.org/2000/svg">
		<path d="M19.6 0.09L19.61 13.26C19.61 15.34 17.42 16.67 15.61 15.7L2.58 8.72C3.58 7.06 4.83 5.58 6.27 4.32L16.49 13.89C17.03 14.4 17.88 13.85 17.66 13.14L13.7 0.49C15.03 0.17 16.42 0 17.85 0C18.44 0 19.02 0.03 19.6 0.09Z" />
		<path d="M16.06 36.11L16.06 23C16.06 20.92 18.24 19.59 20.05 20.56L33.08 27.55C32.08 29.2 30.83 30.68 29.38 31.93L19.17 22.37C18.63 21.86 17.78 22.41 18 23.12L21.95 35.72C20.63 36.03 19.26 36.2 17.85 36.2C17.25 36.2 16.65 36.17 16.06 36.11Z" />
		<path d="M22.01 16.77L31.47 6.39C30.24 4.92 28.77 3.65 27.14 2.64L20.23 15.88C19.27 17.72 20.59 19.93 22.64 19.93L35.62 19.92C35.68 19.32 35.71 18.72 35.71 18.1C35.71 16.67 35.54 15.28 35.23 13.94L22.75 17.96C22.05 18.18 21.51 17.32 22.01 16.77Z" />
		<path d="M0.08 16.34L13.02 16.33C15.08 16.33 16.39 18.55 15.43 20.38L8.56 33.56C6.93 32.55 5.47 31.28 4.24 29.81L13.65 19.49C14.15 18.94 13.61 18.08 12.91 18.3L0.49 22.3C0.17 20.95 0 19.55 0 18.1C0 17.51 0.03 16.92 0.08 16.34Z" />
	</svg>
);

/** EnrichmentIcon (icons.tsx) — three sparkles, white on the #9333EA chip. */
export const EnrichmentGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = "#ffffff",
}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
		<path d="M12 2.5l1.9 4.6 4.6 1.9-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.9L12 2.5z" />
		<path d="M18.5 14l.95 2.3 2.3.95-2.3.95L18.5 20.5l-.95-2.3-2.3-.95 2.3-.95.95-2.3z" />
		<path d="M5.5 14.5l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7.7-1.7z" />
	</svg>
);

/** InstantlyIcon (icons.tsx:454) — blue circle + white lightning. The chip
 *  is white (#FFFFFF), so the icon keeps its own brand colors. */
export const InstantlyGlyph: React.FC<{size?: number}> = ({size = 22}) => (
	<svg width={size} height={size} viewBox="0 0 766.8 766.8" xmlns="http://www.w3.org/2000/svg">
		<circle cx="383.4" cy="383.4" r="383.4" fill="#0081ff" />
		<path
			d="M276.12 438.81h-101.8c-3.58 0-5.83-3.87-4.05-6.98l163.07-284.97h238.63c3.87 0 6.06 4.44 3.69 7.51L459.07 305.59c-2.36 3.07-.18 7.51 3.69 7.51h124.51c4.2 0 6.26 5.11 3.23 8.02L235.8 662.51c-3.37 3.24-8.88.06-7.76-4.48l52.61-213.45c.72-2.93-1.5-5.77-4.53-5.77z"
			fill="#fff"
		/>
	</svg>
);

/** HunterIOIcon (icons.tsx) — the provider chip glyph (orange mark). Used
 *  on the Data Enrichment provider cascade chip. */
export const HunterGlyph: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12.07 8.43C11.66 8.55 11.22 8.55 10.8 8.54C10.31 8.51 9.8 8.45 9.35 8.25C8.98 8.09 8.69 7.79 8.84 7.37C8.95 7.07 9.19 6.8 9.47 6.65C9.79 6.48 10.13 6.5 10.45 6.66C10.8 6.83 11.09 7.11 11.36 7.4C11.5 7.55 11.63 7.7 11.76 7.86C11.83 7.93 12.24 8.34 12.07 8.43ZM18.79 8.58C18.17 8.44 17.43 8.49 16.81 8.39C15.83 8.23 14.36 7.09 13.57 5.92C13.02 5.11 12.76 4.29 12.34 3.28C12.04 2.58 11.4 0.37 10.5 1.4C10.13 1.83 9.72 3.24 9.42 3.22C9.19 3.27 9.16 2.83 9.09 2.65C8.96 2.31 8.89 1.92 8.72 1.6C8.58 1.34 8.4 1.04 8.12 0.91C7.63 0.66 7.04 1.42 6.74 2.33C6.61 2.82 5.77 3.76 5.4 3.99C3.72 5.02 0.34 6.12 0 9.75C0 9.77 0 9.81 0.06 9.77C0.46 9.48 5.02 6.2 2.09 12.55C0.3 16.44 8.96 18.92 9.41 18.93C9.47 18.93 9.46 18.9 9.46 18.88C10.15 12.67 16.98 13.33 18.57 11.84C20.15 10.36 20.18 8.94 18.79 8.58Z"
			fill="#FA5320"
		/>
	</svg>
);

/** Lucide SplitIcon — the parallel-subflow container chip glyph. Dark on the
 *  #FEE12B yellow chip (subflows/parallel/parallel-config.ts, product
 *  luminance rule). */
export const SplitGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 24,
	color = "#1c1c1c",
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M16 3h5v5" />
		<path d="M8 3H3v5" />
		<path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
		<path d="m15 9 6-6" />
	</svg>
);

/** TableIcon (icons.tsx:6487) — lucide grid, white stroke on the #10B981
 *  chip (table.ts; medium-dark chip → light glyph, product luminance
 *  rule, same treatment as the Agent's #33C482). */
export const TableGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = "#ffffff",
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M3 9h18" />
		<path d="M3 15h18" />
		<path d="M9 3v18" />
		<path d="M15 3v18" />
	</svg>
);

// Registry-verified colors for this video's blocks.
export const APOLLO_COLOR = "#EBF212"; // apollo.ts
export const ENRICH_COLOR = "#9333EA"; // enrichment.ts
export const INSTANTLY_COLOR = "#FFFFFF"; // instantly.ts (white chip)
export const PARALLEL_COLOR = "#FEE12B"; // parallel-config.ts
export const HUNTER_COLOR = "#FFFFFF"; // hunter.ts (white chip)
export const TABLE_COLOR = "#10B981"; // table.ts
