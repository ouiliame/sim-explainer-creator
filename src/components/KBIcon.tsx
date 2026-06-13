import React from "react";

// Sim's KB icon — cylinder/database with horizontal dividers.
// Source: _reference/sim/apps/sim/components/emcn/icons/database.tsx
type Props = {
	size?: number;
	color?: string;
	strokeWidth?: number;
};

export const KBIcon: React.FC<Props> = ({size = 24, color = "currentColor", strokeWidth = 1.75}) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="-1 -2 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<ellipse cx="10.25" cy="3.75" rx="8.5" ry="3" />
			<path d="M1.75 3.75V9.75C1.75 11.41 5.55 12.75 10.25 12.75C14.95 12.75 18.75 11.41 18.75 9.75V3.75" />
			<path d="M1.75 9.75V15.75C1.75 17.41 5.55 18.75 10.25 18.75C14.95 18.75 18.75 17.41 18.75 15.75V9.75" />
		</svg>
	);
};
