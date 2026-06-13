import React from "react";

// Brand icons for the problem-exposition prelude. Most are lifted directly from
// Sim's icons.tsx (Apache 2.0) at _reference/sim/apps/sim/components/icons.tsx.
// Notion is custom because Sim's path has malformed SVG arc commands; PDF and
// Markdown are custom because Sim doesn't ship branded versions.
//
// Each icon component renders at the size requested via the `size` prop and is
// safe to drop into a `<SourceCard />` slot.

type IconProps = {size?: number};

const wrap = (size: number, children: React.ReactNode, viewBox = "0 0 24 24") => (
	<svg
		width={size}
		height={size}
		viewBox={viewBox}
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		{children}
	</svg>
);

export const NotionIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<rect x="2" y="2" width="20" height="20" rx="3" fill="#ffffff" stroke="#0d0d0d" strokeWidth="1.5" />
			<rect x="7.2" y="6.5" width="1.9" height="11" fill="#0d0d0d" />
			<rect x="15.5" y="6.5" width="1.9" height="11" fill="#0d0d0d" />
			<polygon points="9.1,6.5 11,6.5 17.4,17.5 15.5,17.5" fill="#0d0d0d" />
		</>,
	);

export const AirtableIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<g>
			<path
				d="M10.7 2.7 1.8 6.4c-0.5 0.2-0.5 0.9 0 1.1l8.9 3.5c0.8 0.3 1.7 0.3 2.5 0l8.9-3.5c0.5-0.2 0.5-0.9 0-1.1L13.2 2.7c-0.8-0.3-1.7-0.3-2.5 0z"
				fill="#FFBF00"
			/>
			<path
				d="M12.7 10.5v8.9c0 0.4 0.4 0.7 0.8 0.6l10-3.9c0.2-0.1 0.4-0.3 0.4-0.6V6.7c0-0.4-0.4-0.7-0.8-0.6L13 10c-0.2 0.1-0.4 0.3-0.4 0.5z"
				fill="#26B5F8"
			/>
			<path
				d="M10.5 11l-3 1.4-0.3 0.1L0.9 15.6c-0.4 0.2-0.9-0.1-0.9-0.5V6.7C0 6.5 0.1 6.4 0.2 6.3c0 0 0.1-0.1 0.1-0.1 0.2-0.1 0.4-0.1 0.6 0L10.4 9.9c0.5 0.2 0.5 0.9 0.1 1.1z"
				fill="#ED3049"
			/>
		</g>,
	);

export const GoogleDocsIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path
				fill="#2196f3"
				d="M18.5,22.5h-13c-0.83,0-1.5-0.67-1.5-1.5V3c0-0.83,0.67-1.5,1.5-1.5h9.5l5,5v14.5C20,21.83,19.33,22.5,18.5,22.5z"
			/>
			<polygon fill="#bbdefb" points="20,6.5 15,6.5 15,1.5" />
			<polygon fill="#1565c0" points="15,6.5 20,11.5 20,6.5" />
			<rect x="7.5" y="11.5" width="9" height="1" fill="#e3f2fd" />
			<rect x="7.5" y="13.5" width="9" height="1" fill="#e3f2fd" />
			<rect x="7.5" y="15.5" width="9" height="1" fill="#e3f2fd" />
			<rect x="7.5" y="17.5" width="5" height="1" fill="#e3f2fd" />
		</>,
	);

export const GoogleSheetsIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path
				fill="#43a047"
				d="M18.5,22.5h-13c-0.83,0-1.5-0.67-1.5-1.5V3c0-0.83,0.67-1.5,1.5-1.5h9.5l5,5v14.5C20,21.83,19.33,22.5,18.5,22.5z"
			/>
			<polygon fill="#c8e6c9" points="20,6.5 15,6.5 15,1.5" />
			<polygon fill="#2e7d32" points="15,6.5 20,11.5 20,6.5" />
			<path
				fill="#e8f5e9"
				d="M15.5,11.5h-7h-1v1v1v1v1v1v1v1h9v-1v-1v-1v-1v-1v-1v-1H15.5z M8.5,12.5h2v1h-2V12.5z M8.5,14.5h2v1h-2V14.5z M8.5,16.5h2v1h-2V16.5z M15.5,17.5h-4v-1h4V17.5z M15.5,15.5h-4v-1h4V15.5z M15.5,13.5h-4v-1h4V13.5z"
			/>
		</>,
	);

export const GoogleSlidesIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path
				fill="#FFC107"
				d="M18.5,22.5h-13c-0.83,0-1.5-0.67-1.5-1.5V3c0-0.83,0.67-1.5,1.5-1.5h9.5l5,5v14.5C20,21.83,19.33,22.5,18.5,22.5z"
			/>
			<polygon fill="#FFECB3" points="20,6.5 15,6.5 15,1.5" />
			<polygon fill="#FFA000" points="15,6.5 20,11.5 20,6.5" />
			<rect x="7" y="10.5" width="10" height="7" fill="#FFF8E1" />
			<rect x="8" y="11.5" width="8" height="1.5" fill="#FFA000" />
			<rect x="8" y="14" width="6" height="1" fill="#FFA000" />
		</>,
	);

export const GmailIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path fill="#4caf50" d="M22.5,8.1l-2.5,1.38l-2.5,2.38L17.5,20h3.5c0.83,0,1.5-0.67,1.5-1.5V8.1z" />
			<path fill="#1e88e5" d="M1.5,8.1l1.81,0.86L6.5,11.85V20H3c-0.83,0-1.5-0.67-1.5-1.5V8.1z" />
			<polygon
				fill="#e53935"
				points="17.5,5.6 12,9.73 6.5,5.6 6,8.5 6.5,11.85 12,15.98 17.5,11.85 18,8.5"
			/>
			<path
				fill="#c62828"
				d="M1.5,6.15v1.95l5,3.75V5.6L4.94,4.43C4.57,4.15,4.12,4,3.65,4h0C2.46,4,1.5,4.96,1.5,6.15z"
			/>
			<path
				fill="#fbc02d"
				d="M22.5,6.15v1.95l-5,3.75V5.6l1.56-1.17C19.43,4.15,19.88,4,20.35,4h0C21.54,4,22.5,4.96,22.5,6.15z"
			/>
		</>,
	);

export const PdfIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path
				fill="#e53935"
				d="M18.5,22.5h-13c-0.83,0-1.5-0.67-1.5-1.5V3c0-0.83,0.67-1.5,1.5-1.5h9.5l5,5v14.5C20,21.83,19.33,22.5,18.5,22.5z"
			/>
			<polygon fill="#ffcdd2" points="20,6.5 15,6.5 15,1.5" />
			<polygon fill="#b71c1c" points="15,6.5 20,11.5 20,6.5" />
			<text
				x="12"
				y="18.2"
				textAnchor="middle"
				fontFamily="ui-sans-serif, system-ui, sans-serif"
				fontWeight="700"
				fontSize="6"
				fill="#ffffff"
			>
				PDF
			</text>
		</>,
	);

export const MarkdownIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<rect x="2" y="5" width="20" height="14" rx="2" fill="#0d0d0d" />
			<path
				d="M5 15.5V8.5h1.4l2 2.7 2-2.7H11.8V15.5h-1.4v-4.5l-2 2.6-2-2.6V15.5H5z"
				fill="#ffffff"
			/>
			<path d="M16 8.5h1.6v4.2h1.6L16.8 15.5l-2.4-2.8H16V8.5z" fill="#ffffff" />
		</>,
	);

export const NoteIcon: React.FC<IconProps> = ({size = 28}) =>
	wrap(
		size,
		<>
			<path d="M4 4h12l4 4v12H4z" fill="#fff59d" stroke="#fbc02d" strokeWidth="1" />
			<path d="M16 4v4h4" fill="#ffeb3b" stroke="#fbc02d" strokeWidth="1" />
			<line x1="7" y1="11" x2="14" y2="11" stroke="#a0a0a0" strokeWidth="1" />
			<line x1="7" y1="14" x2="16" y2="14" stroke="#a0a0a0" strokeWidth="1" />
			<line x1="7" y1="17" x2="13" y2="17" stroke="#a0a0a0" strokeWidth="1" />
		</>,
	);

export const SpreadsheetIcon: React.FC<IconProps> = ({size = 28}) => GoogleSheetsIcon({size});

export const SourceIconByKind: Record<
	"notion" | "airtable" | "docs" | "sheets" | "slides" | "gmail" | "pdf" | "md" | "note",
	React.FC<IconProps>
> = {
	notion: NotionIcon,
	airtable: AirtableIcon,
	docs: GoogleDocsIcon,
	sheets: GoogleSheetsIcon,
	slides: GoogleSlidesIcon,
	gmail: GmailIcon,
	pdf: PdfIcon,
	md: MarkdownIcon,
	note: NoteIcon,
};

export type SourceKind = keyof typeof SourceIconByKind;
