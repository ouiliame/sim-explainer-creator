import React from "react";

// Icons for the core Sim object model, used across every Academy video.
// Stroke paths lifted from Sim's emcn icon set (Apache 2.0); a few are custom
// where Sim ships only a filled glyph. All render at `size` px, stroke = color.

type IconProps = {size?: number; color?: string; strokeWidth?: number};

const stroke = (
	size: number,
	color: string,
	strokeWidth: number,
	children: React.ReactNode,
	viewBox = "-1 -2 24 24",
) => (
	<svg
		width={size}
		height={size}
		viewBox={viewBox}
		fill="none"
		stroke={color}
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		{children}
	</svg>
);

export const WorkflowGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<circle cx="10.25" cy="3.5" r="2.75" />
			<path d="M10.25 6.25V10" />
			<path d="M5 12a2 2 0 0 1 2-2h6.5a2 2 0 0 1 2 2v2" />
			<rect x="3" y="14" width="7.5" height="4.75" rx="1.75" />
			<rect x="11.5" y="14" width="7.5" height="4.75" rx="1.75" />
		</>,
	);

export const TableGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<path d="M0.75 3.25C0.75 1.87 1.87 0.75 3.25 0.75H17.25C18.63 0.75 19.75 1.87 19.75 3.25V16.25C19.75 17.63 18.63 18.75 17.25 18.75H3.25C1.87 18.75 0.75 17.63 0.75 16.25V3.25Z" />
			<path d="M0.75 6.75H19.75" />
			<path d="M0.75 12.75H19.75" />
			<path d="M10.25 0.75V18.75" />
		</>,
	);

export const FileGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<path d="M12.25 0.75H5.25C4.15 0.75 3.25 1.65 3.25 2.75V16.75C3.25 17.85 4.15 18.75 5.25 18.75H15.25C16.35 18.75 17.25 17.85 17.25 16.75V5.75L12.25 0.75Z" />
			<path d="M12.25 0.75V5.75H17.25" />
		</>,
	);

// Database/cylinder — same as KBIcon, re-exported here for object-model uniformity.
export const KnowledgeGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<ellipse cx="10.25" cy="3.75" rx="8.5" ry="3" />
			<path d="M1.75 3.75V9.75C1.75 11.41 5.55 12.75 10.25 12.75C14.95 12.75 18.75 11.41 18.75 9.75V3.75" />
			<path d="M1.75 9.75V15.75C1.75 17.41 5.55 18.75 10.25 18.75C14.95 18.75 18.75 17.41 18.75 15.75V9.75" />
		</>,
	);

export const DeploymentGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<path d="M11 1.75C8.5 4.75 7.25 8.75 7.25 12.75V15.75H14.75V12.75C14.75 8.75 13.5 4.75 11 1.75Z" />
			<path d="M7.25 12.75L4.25 15.75H7.25" />
			<path d="M14.75 12.75L17.75 15.75H14.75" />
			<circle cx="11" cy="9.75" r="1.75" />
			<path d="M9 15.75V18.25" />
			<path d="M13 15.75V18.25" />
		</>,
	);

export const LogsGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<rect x="0.75" y="1.75" width="18.5" height="15.5" rx="2.5" />
			<path d="M0.75 6H19.25" />
			<path d="M4 9.5L6.25 11.75L4 14" />
			<path d="M9.5 14H14.5" />
		</>,
	);

// Tool / integration — a plug/connector.
export const ToolGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<path d="M6.5 12.5L2.8 16.2a2.5 2.5 0 0 0 3.5 3.5L10 16" />
			<path d="M13.5 7.5L17.2 3.8a2.5 2.5 0 0 1 3.5 3.5L17 11" />
			<path d="M8 14L14 8" />
			<path d="M5 9.5L3 7.5" />
			<path d="M14.5 19L16.5 17" />
		</>,
	);

// Mothership — a spark / command surface.
export const MothershipGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<path d="M10 1.5L11.8 7.2L17.5 9L11.8 10.8L10 16.5L8.2 10.8L2.5 9L8.2 7.2L10 1.5Z" />
		</>,
	);

// Agent — a reasoning node (head + signal).
export const AgentGlyph: React.FC<IconProps> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) =>
	stroke(
		size,
		color,
		strokeWidth,
		<>
			<rect x="3.5" y="6" width="13" height="10" rx="2.5" />
			<circle cx="8" cy="11" r="1.2" fill={color} />
			<circle cx="12" cy="11" r="1.2" fill={color} />
			<path d="M10 6V2.5" />
			<circle cx="10" cy="2" r="1.2" />
			<path d="M3.5 10H1.5" />
			<path d="M18.5 10H16.5" />
		</>,
	);
