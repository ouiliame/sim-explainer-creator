import React from "react";
import {interpolate} from "remotion";
import {COLORS, EASING, usePalette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	CanvasDots,
	ResponseGlyphW,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	Tag,
	type SimBlockTool,
} from "../../../components";
import {
	blockX,
	CARD_H,
	CARD_W,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	edgeX1,
	edgeX2,
	slotRect,
	STAGE_H,
	STAGE_W,
	VIEW_H,
	VIEW_RECT,
	VIEW_W,
} from "../layout";

// The browser-agent set piece ("The Agent With Hands"): the docs-shaped
// chain — Start {Input: Competitor} → Research (agent + the registry's own
// research-stack toolset: Exa finds, Firecrawl reads, Browser Use acts) →
// Response {Data: {"brief": <research.content>}} — above the four-slot
// evidence rail the run fills up. Every captured value is ⟨pending⟩ (no
// real run artifact, batch build): captured content renders as the house
// skeleton-line language, never invented words. See script-v1.md.

// ---------------------------------------------------------------------------
// Tool glyphs, ported from the product (apps/sim/components/icons.tsx).
// ---------------------------------------------------------------------------

/** ExaAIIcon — white lettermark on the registry's #1F40ED chip. */
export const ExaGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="-26 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4.82 0.75C5.94 0.75 5.94 0.75 7.09 0.75C7.95 0.75 8.81 0.74 9.69 0.74C10.64 0.74 11.59 0.75 12.57 0.75C13.58 0.75 14.58 0.75 15.62 0.75C19.01 0.74 22.4 0.75 25.79 0.76C28.22 0.76 30.64 0.75 33.06 0.75C38.97 0.75 44.88 0.75 50.79 0.76C57.66 0.77 64.54 0.77 71.41 0.77C83.67 0.77 95.94 0.78 108.2 0.79C120.11 0.81 132.02 0.82 143.93 0.81C144.67 0.81 145.4 0.81 146.16 0.81C146.89 0.81 147.62 0.81 148.38 0.81C161.92 0.81 175.46 0.82 189.01 0.83C193.8 0.83 198.6 0.83 203.4 0.83C209.85 0.83 216.3 0.84 222.75 0.85C225.12 0.85 227.5 0.85 229.87 0.85C233.1 0.85 236.33 0.86 239.55 0.87C240.51 0.86 241.46 0.86 242.44 0.86C248.89 0.89 248.89 0.89 250 2C252.1 17.51 252.1 17.51 247.83 23.73C245.55 26.54 243.02 29.08 240.42 31.59C238.38 33.62 236.64 35.85 234.88 38.13C231.09 42.9 227.24 47.62 223.37 52.33C222.38 53.53 221.4 54.73 220.41 55.94C214.43 63.23 208.44 70.51 202.31 77.69C198.11 82.61 194.1 87.66 190.13 92.76C186.1 97.93 181.88 102.93 177.63 107.91C173.67 112.54 169.84 117.28 166 122C164.5 123.83 163 125.67 161.5 127.5C159.2 130.31 156.91 133.12 154.61 135.93C153.83 136.88 153.05 137.83 152.25 138.81C151.51 139.72 150.78 140.63 150.02 141.56C148.81 143.02 147.58 144.46 146.29 145.85C143.62 148.63 143.62 148.63 143.08 152.29C144.29 155.84 146.41 158.21 148.88 160.94C149.88 162.09 150.89 163.24 151.89 164.39C152.66 165.28 152.66 165.28 153.45 166.18C155.96 169.13 158.32 172.19 160.69 175.25C164.27 179.87 167.99 184.29 171.92 188.61C174.48 191.55 176.86 194.61 179.25 197.69C183.1 202.66 187.07 207.5 191.19 212.25C195.14 216.82 199 221.44 202.75 226.18C206.38 230.72 210.09 235.2 213.79 239.68C217.1 243.7 220.4 247.72 223.69 251.75C226.93 255.73 230.24 259.65 233.56 263.56C238.15 268.96 242.64 274.42 247 280C247.85 280.84 247.85 280.84 248.71 281.7C250.78 285.39 250.31 289.11 250.19 293.25C250.17 294.09 250.16 294.93 250.15 295.8C250.11 297.87 250.06 299.93 250 302C247.72 303.14 246.47 303.13 243.93 303.13C243.08 303.13 242.22 303.14 241.34 303.14C240.39 303.14 239.45 303.14 238.47 303.13C237.47 303.14 236.47 303.14 235.44 303.14C232.06 303.15 228.69 303.15 225.31 303.15C222.9 303.15 220.49 303.15 218.08 303.15C212.2 303.16 206.32 303.17 200.44 303.17C195.66 303.17 190.88 303.17 186.1 303.17C172.57 303.18 159.03 303.19 145.5 303.19C144.77 303.19 144.04 303.19 143.28 303.19C142.55 303.19 141.82 303.19 141.07 303.19C129.21 303.19 117.36 303.19 105.5 303.21C93.34 303.22 81.18 303.23 69.02 303.23C62.19 303.23 55.36 303.23 48.52 303.24C42.1 303.25 35.68 303.25 29.26 303.25C26.89 303.24 24.53 303.25 22.17 303.25C18.95 303.26 15.74 303.26 12.53 303.25C11.58 303.25 10.64 303.26 9.66 303.26C8.81 303.26 7.95 303.25 7.07 303.25C6.32 303.25 5.58 303.25 4.82 303.25C3 303 3 303 1 301C0.75 298.84 0.75 298.84 0.75 296.11C0.74 295.07 0.74 294.02 0.73 292.95C0.74 291.8 0.74 290.65 0.75 289.46C0.74 288.24 0.74 287.02 0.74 285.77C0.73 282.38 0.73 278.99 0.74 275.6C0.74 271.95 0.74 268.3 0.73 264.65C0.72 257.49 0.72 250.34 0.73 243.18C0.73 237.37 0.73 231.55 0.73 225.74C0.73 224.91 0.73 224.09 0.73 223.23C0.73 221.56 0.73 219.88 0.73 218.2C0.72 202.45 0.73 186.7 0.74 170.94C0.75 157.42 0.75 143.89 0.74 130.36C0.73 114.67 0.72 98.97 0.73 83.28C0.73 81.61 0.73 79.93 0.73 78.26C0.73 77.03 0.73 77.03 0.73 75.77C0.74 69.96 0.73 64.15 0.73 58.34C0.72 51.26 0.72 44.19 0.73 37.11C0.74 33.5 0.74 29.88 0.73 26.27C0.73 22.36 0.74 18.45 0.75 14.54C0.74 13.39 0.74 12.24 0.73 11.05C0.74 10.01 0.74 8.97 0.75 7.89C0.75 6.99 0.75 6.09 0.75 5.16C1.08 2.33 1.93 1.15 4.82 0.75ZM39 25C40.5 28.01 41.66 29.99 43.72 32.5C44.26 33.16 44.79 33.81 45.34 34.48C45.91 35.17 46.48 35.85 47.06 36.56C47.65 37.28 48.24 38 48.84 38.73C50.56 40.83 52.28 42.91 54 45C55.5 46.83 57 48.67 58.5 50.5C59.2 51.36 59.91 52.22 60.63 53.11C74.85 70.49 74.85 70.49 81.44 78.94C86.65 85.62 92.04 92.16 97.45 98.7C106.5 109.65 115.41 120.68 124 132C126.94 131.67 127.95 131.05 130.04 128.88C130.75 127.97 131.46 127.06 132.19 126.13C132.98 125.13 133.77 124.12 134.58 123.09C135.38 122.07 136.18 121.05 137 120C138.45 118.2 139.91 116.41 141.38 114.63C142.11 113.72 142.85 112.82 143.61 111.89C146.24 108.71 148.9 105.57 151.56 102.44C155.36 97.97 159.07 93.45 162.71 88.86C167.53 82.84 172.46 76.92 177.37 70.98C181.65 65.78 185.91 60.57 190.16 55.34C193.83 50.84 197.53 46.37 201.3 41.95C209.03 34.26 209.03 34.26 213 25C155.58 25 98.16 25 39 25ZM25 48C25 78.36 25 108.72 25 140C49.42 140 73.84 140 99 140C97.17 135.43 95.23 132.63 92.06 129.06C88.15 124.55 84.35 119.97 80.69 115.25C75.9 109.09 70.96 103.05 65.98 97.04C62.31 92.6 58.69 88.14 55.1 83.63C51.81 79.51 48.48 75.42 45.15 71.34C42.2 67.72 39.27 64.09 36.34 60.45C35.75 59.71 35.16 58.98 34.55 58.22C33.41 56.81 32.27 55.39 31.14 53.96C28.5 50.49 28.5 50.49 25 48ZM25 164C25 194.36 25 224.72 25 256C29.05 252.76 31.89 249.85 34.94 245.81C39.15 240.33 43.47 234.95 47.88 229.63C49.07 228.18 50.26 226.74 51.45 225.3C52.04 224.59 52.63 223.87 53.24 223.14C60.6 214.21 67.86 205.21 74.97 196.08C78.1 192.09 81.33 188.22 84.63 184.38C93.89 174.95 93.89 174.95 99 164C74.58 164 50.16 164 25 164ZM124 172C122.3 173.68 122.3 173.68 120.63 176C119.92 176.91 119.22 177.83 118.5 178.77C118.1 179.28 117.71 179.79 117.3 180.32C114.82 183.51 112.25 186.62 109.69 189.75C105.53 194.85 101.42 199.99 97.38 205.19C93.41 210.27 89.31 215.22 85.12 220.12C81.4 224.48 77.86 228.96 74.34 233.48C69.99 239.05 65.5 244.5 60.99 249.95C57.25 254.48 53.54 259.04 49.89 263.65C46.88 267.4 43.78 271.07 40.69 274.75C38.8 276.8 38.8 276.8 39 279C96.42 279 153.84 279 213 279C211.09 274.23 208.91 271.29 205.56 267.56C201.39 262.81 197.36 258 193.5 253C189.8 248.21 185.97 243.57 182 239C177.55 233.87 173.3 228.62 169.15 223.25C165.88 219.06 162.48 215.01 159 211C154.55 205.88 150.32 200.64 146.16 195.27C142.25 190.25 138.15 185.42 133.97 180.62C131.99 178.33 130.06 176.09 128.34 173.6C127.9 173.07 127.46 172.55 127 172C126.01 172 125.02 172 124 172Z"
			fill="#ffffff"
		/>
	</svg>
);

/** FirecrawlIcon — the multicolor flame (like the Gmail multicolor-glyph
 *  precedent), on the registry's #181C1E chip. Paths verbatim. */
export const FirecrawlGlyph: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="30.778 11.238 575.239 571.826" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M301 63C299 91 303 122 298 149C295 158 289 165 283 169C274 172 266 170 261 167C253 176 248 183 244 191C230 226 226 263 226 301C216 310 203 317 192 310C179 295 175 277 174 259C161 273 153 288 146 304C141 321 138 336 137 352C140 372 145 388 152 402C161 421 174 435 187 449C181 462 165 453 157 450C158 454 161 458 165 461C195 490 231 500 268 509C240 494 211 471 195 442C179 413 172 378 180 344C191 353 200 362 211 364C223 365 232 361 236 353C247 274 299 214 323 143C322 136 327 140 329 142C354 165 367 191 375 218C387 254 381 294 379 329C393 345 413 334 424 329C429 342 432 352 429 362C427 378 417 388 413 400C422 407 433 403 440 400C432 423 419 442 404 460C383 483 358 501 335 512C379 502 420 491 449 459C443 458 427 464 428 452C443 437 464 423 472 403C482 383 485 362 484 339C482 307 472 280 458 254C459 267 452 276 445 284C434 289 426 279 424 272C415 247 424 220 418 198C415 179 405 165 397 150C370 114 336 86 303 64"
			fill="rgb(253,76,31)"
		/>
		<path
			d="M324 141C303 214 249 273 244 354C235 359 229 364 223 366C205 367 193 357 182 347C180 350 179 353 180 357C178 374 178 390 182 403C185 421 193 434 200 448C212 465 227 480 243 491C258 500 269 513 285 512C284 508 257 485 252 468C241 450 235 433 233 414C241 415 254 420 263 412C260 387 265 363 273 343C281 323 293 306 310 295C317 289 324 285 330 282C328 307 328 331 329 355C330 368 332 379 338 389C358 394 376 384 388 370C383 386 377 401 371 415C376 414 381 411 385 408C383 421 380 431 376 441C366 467 356 491 334 510C358 499 381 483 400 461C418 442 430 423 440 403C432 404 421 410 413 404C414 386 428 377 427 360C429 349 428 340 424 332C413 336 404 341 392 339C386 338 381 334 379 330C380 292 385 248 371 214C366 195 358 180 349 165C341 155 333 145 323 140"
			fill="rgb(254,156,69)"
		/>
		<path
			d="M330 284C309 293 289 311 279 332C267 356 261 383 265 411C256 420 242 418 235 412C237 438 245 459 258 479C269 493 281 507 295 513C288 495 265 472 265 446C272 447 281 454 288 444C296 425 303 407 309 388C317 406 321 427 336 443C346 449 358 446 363 438C355 464 348 489 334 511C344 501 352 491 357 480C370 457 379 435 385 412C380 411 376 416 371 418C376 401 382 386 387 371C379 382 369 388 358 391C348 394 337 392 334 383C324 353 328 316 330 285"
			fill="rgb(254,220,87)"
		/>
		<path
			d="M311 389C303 407 297 426 289 445C282 454 273 450 268 445C267 472 285 492 302 512C299 514 297 514 294 514C297 514 299 514 301 514C314 515 325 512 334 513C341 495 355 467 362 443C357 446 351 448 344 447C337 446 334 441 330 438C320 422 316 406 311 391"
			fill="rgb(251,250,202)"
		/>
		<path
			d="M187 163C188 181 167 187 164 203C158 215 158 228 159 241C172 233 183 221 188 209C193 194 192 178 188 166"
			fill="rgb(253,76,31)"
		/>
	</svg>
);

/** BrowserUseIcon — white mark on the registry's #181C1E chip. */
export const BrowserUseGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
		<g transform="translate(0,150) scale(0.05,-0.05)" fill="#ffffff" stroke="none">
			<path d="M786 2713 c-184 -61 -353 -217 -439 -405 -76 -165 -65 -539 19 -666 l57 -85 -48 -124 c-203 -517 -79 -930 346 -1155 159 -85 441 -71 585 28 l111 77 196 -76 c763 -293 1353 304 1051 1063 -77 191 -77 189 -14 282 163 239 97 660 -140 893 -235 231 -528 256 -975 83 l-96 -37 -121 67 c-144 79 -383 103 -532 55z m459 -235 c88 -23 96 -51 22 -79 -29 -11 -84 -47 -121 -80 -57 -50 -84 -59 -178 -59 -147 0 -190 -44 -238 -241 -102 -424 -230 -440 -230 -29 1 417 289 606 745 488z m1046 -18 c174 -85 266 -309 239 -582 -26 -256 -165 -165 -230 151 -73 356 -469 332 -954 -58 -587 -472 -829 -1251 -388 -1251 108 0 126 -7 214 -80 54 -44 104 -80 113 -80 54 0 -2 -43 -89 -69 -220 -66 -426 -22 -568 120 -599 599 871 2232 1663 1849z m-234 -510 c969 -1036 357 -1962 -787 -1190 -254 171 -348 303 -323 454 21 128 40 123 231 -59 691 -658 1362 -583 1052 117 -106 239 -366 585 -504 671 l-72 44 98 45 c150 68 169 63 305 -82z m-329 -310 c161 -184 163 -160 -30 -338 -188 -173 -180 -173 -386 19 -163 153 -163 157 7 324 218 213 219 213 409 -5z m354 -375 c92 -239 -179 -462 -377 -309 l-46 35 186 163 c211 186 209 185 237 111z" />
		</g>
	</svg>
);

// Registry chip identities (colors from apps/sim/blocks/blocks/{exa,firecrawl,browser_use}.ts).
export const EXA_COLOR = "#1F40ED";
export const FIRECRAWL_COLOR = "#181C1E";
export const BROWSER_USE_COLOR = "#181C1E";

// ---------------------------------------------------------------------------
// Shared vis types + timing helpers
// ---------------------------------------------------------------------------

export type BlockVis = {
	opacity?: number;
	dim?: number; // 0..1 → toward 0.35
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};
export type EdgeVis = {progress?: number; opacity?: number; dim?: number};
export type ChipVis = {ring?: number; reveal?: number};
export type CardVis = {
	/** 0..1 popIn — the card drops into its slot. At rest exactly 1. */
	reveal?: number;
	/** 0..1 transient green capture ring on landing. */
	pulse?: number;
	/** 0..1 selection-blue glow (the agent is reading this evidence). */
	glow?: number;
	/** 0..1 staggered body-content reveal (defaults to reveal). */
	body?: number;
	dim?: number;
	/** Render nothing (scene 5 owns slot 4 while the viewport folds). */
	hidden?: boolean;
};

export const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

/** clamp-interpolate shorthand */
export const cv = (t: number, lo: number, hi: number, a = 0, b = 1) =>
	interpolate(t, [lo, hi], [a, b], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

/** A glow that rises at `a`, holds, and falls to zero by `b`. */
export const wave = (t: number, a: number, b: number, ramp = 0.35) =>
	Math.min(cv(t, a, a + ramp), cv(t, b - ramp, b, 1, 0));

/** EASING.inOut ease between two numbers. */
export const easeIO = (t: number, lo: number, hi: number, a: number, b: number) =>
	interpolate(t, [lo, hi], [a, b], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

// ---------------------------------------------------------------------------
// Chain edge
// ---------------------------------------------------------------------------

export const ChainEdge: React.FC<{i: 0 | 1} & EdgeVis> = ({i, progress = 1, opacity = 1, dim = 0}) => (
	<svg
		width={STAGE_W}
		height={STAGE_H}
		viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
		style={{position: "absolute", inset: 0, opacity: opacity * (1 - 0.65 * dim), pointerEvents: "none"}}
	>
		<SimEdgePath x1={edgeX1(i)} y1={CHAIN_EDGE_Y} x2={edgeX2(i)} y2={CHAIN_EDGE_Y} progress={progress} />
	</svg>
);

// ---------------------------------------------------------------------------
// Skeleton-line language (ChunkCard lineage): captured content is shapes,
// never words — every readable value is ⟨pending⟩ a real run artifact.
// ---------------------------------------------------------------------------

const Bar: React.FC<{
	w: number | string;
	h?: number;
	op?: number;
	color?: string;
	r?: number;
	style?: React.CSSProperties;
}> = ({w, h = 6, op = 0.35, color = COLORS.textMuted, r = 3, style}) => (
	<div style={{width: w, height: h, borderRadius: r, backgroundColor: color, opacity: op, ...style}} />
);

const seededPct = (seed: number, i: number, base = 88, span = 30) =>
	base - ((seed * 7 + i * 13) % span);

// ---------------------------------------------------------------------------
// Evidence cards (the filmstrip). House card grammar: surface2 / border1 /
// r8, a 36px header strip carrying ONLY the tool chip (provenance is the
// glyph — the synced chip ring already taught the mapping), skeleton body.
// ---------------------------------------------------------------------------

const CardShell: React.FC<{
	x: number;
	y: number;
	vis: CardVis;
	chip: {color: string; glyph: React.ReactNode};
	children: React.ReactNode;
}> = ({x, y, vis, chip, children}) => {
	const reveal = vis.reveal ?? 0;
	if (vis.hidden || reveal <= 0) return null;
	const dimOp = 1 - 0.65 * (vis.dim ?? 0);
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y - 26 * (1 - reveal),
				width: CARD_W,
				height: CARD_H,
				opacity: Math.min(1, reveal * 1.4) * dimOp,
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: 8,
				boxSizing: "border-box",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					height: 36,
					backgroundColor: COLORS.surface3,
					borderBottom: `1px solid ${COLORS.border}`,
					display: "flex",
					alignItems: "center",
					padding: "0 10px",
					gap: 8,
				}}
			>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 5,
						background: chip.color,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{chip.glyph}
				</div>
				<Bar w={120} h={6} op={0.3} />
			</div>
			<div style={{position: "relative", height: CARD_H - 36 - 2}}>{children}</div>
			{(vis.glow ?? 0) > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: 8,
						backgroundColor: `rgba(51, 180, 255, ${0.08 * (vis.glow ?? 0)})`,
						boxShadow: `inset 0 0 0 2.5px rgba(51, 180, 255, ${0.85 * (vis.glow ?? 0)})`,
						pointerEvents: "none",
					}}
				/>
			) : null}
			{(vis.pulse ?? 0) > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: 8,
						boxShadow: `inset 0 0 0 2.5px rgba(34, 197, 94, ${0.9 * (vis.pulse ?? 0)})`,
						pointerEvents: "none",
					}}
				/>
			) : null}
		</div>
	);
};

/** Card 1 — Exa search results: favicon-dot + title/sub line rows. */
export const SearchCard: React.FC<{slot: 0 | 1 | 2 | 3; vis: CardVis}> = ({slot, vis}) => {
	const {x, y} = slotRect(slot);
	const body = vis.body ?? vis.reveal ?? 0;
	return (
		<CardShell x={x} y={y} vis={vis} chip={{color: EXA_COLOR, glyph: <ExaGlyphW size={12} />}}>
			<div style={{padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14}}>
				{[0, 1, 2].map((i) => {
					const rowR = cv(body, 0.2 + i * 0.27, 0.45 + i * 0.27);
					if (rowR <= 0) return null;
					return (
						<div key={i} style={{display: "flex", gap: 10, alignItems: "flex-start", opacity: rowR}}>
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: 3,
									backgroundColor: COLORS.textMuted,
									opacity: 0.55,
									marginTop: 1,
									flexShrink: 0,
								}}
							/>
							<div style={{display: "flex", flexDirection: "column", gap: 6, flex: 1}}>
								<Bar w={`${seededPct(3, i, 86, 26)}%`} h={7} op={0.55} color={COLORS.textTertiary} />
								<Bar w={`${seededPct(5, i, 60, 24)}%`} h={5} op={0.3} />
							</div>
						</div>
					);
				})}
			</div>
		</CardShell>
	);
};

/** Cards 2/3 — Firecrawl page captures: title bar + paragraph skeleton. */
export const PageCard: React.FC<{slot: 0 | 1 | 2 | 3; vis: CardVis; seed: number}> = ({
	slot,
	vis,
	seed,
}) => {
	const {x, y} = slotRect(slot);
	const body = vis.body ?? vis.reveal ?? 0;
	return (
		<CardShell
			x={x}
			y={y}
			vis={vis}
			chip={{color: FIRECRAWL_COLOR, glyph: <FirecrawlGlyph size={13} />}}
		>
			<div style={{padding: "14px 16px", display: "flex", flexDirection: "column", gap: 9}}>
				<div style={{opacity: cv(body, 0.15, 0.4)}}>
					<Bar w={`${seededPct(seed, 0, 62, 18)}%`} h={9} op={0.55} color={COLORS.textTertiary} r={4} />
				</div>
				<div style={{height: 3}} />
				{[1, 2, 3, 4, 5].map((i) => {
					const rowR = cv(body, 0.25 + i * 0.11, 0.5 + i * 0.11);
					if (rowR <= 0) return null;
					return (
						<div key={i} style={{opacity: rowR}}>
							<Bar w={`${seededPct(seed, i, 92, 30)}%`} h={5} op={0.32} />
						</div>
					);
				})}
			</div>
		</CardShell>
	);
};

// ---------------------------------------------------------------------------
// The live-session viewport (Browser Use). The product's own surface: the
// block outputs a liveUrl ("Embeddable live browser session URL"). Drawn at
// VIEW_RECT (a rail slot ×2.3, same aspect) so the exit fold is a uniform
// scale onto slot 4 — the session becomes its own evidence card.
// ---------------------------------------------------------------------------

export type ViewportState = {
	/** 0..1 chrome + frame reveal (rise/fade-in). */
	reveal?: number;
	/** 0 = landing wireframe, 1 = pricing layout (dip-swap at the midpoint). */
	page?: number;
	/** Cursor position in viewport coords; null = no cursor. */
	cursor?: {x: number; y: number; opacity: number} | null;
	/** Click ripples: progress 0..1 each, at viewport coords. */
	ripples?: {x: number; y: number; p: number}[];
	/** Per-plan capture: blue glow 0..1, then green settle 0..1 (residue stays). */
	captures?: {glow: number; green: number}[];
	/** 0..1 fold onto rail slot 4 (EASING.inOut driven by the scene). */
	fold?: number;
};

const CHROME_H = 56;

/** Final at-rest state: the session card sitting in slot 4. */
export const SESSION_FINAL: ViewportState = {
	reveal: 1,
	page: 1,
	cursor: null,
	ripples: [],
	// Residual green = provenance (ResolvedTag-residue precedent): these are
	// the captured regions.
	captures: [
		{glow: 0, green: 0.25},
		{glow: 0, green: 0.25},
		{glow: 0, green: 0.25},
	],
	fold: 1,
};

/** One pricing-plan wireframe (used inside the viewport page B). */
const PlanCard: React.FC<{seed: number; capture?: {glow: number; green: number}}> = ({
	seed,
	capture,
}) => (
	<div
		style={{
			width: 200,
			height: 280,
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: 8,
			padding: 18,
			boxSizing: "border-box",
			display: "flex",
			flexDirection: "column",
			gap: 11,
			position: "relative",
		}}
	>
		{/* capture region = plan name + price */}
		<div style={{position: "relative", display: "flex", flexDirection: "column", gap: 11}}>
			{capture && (capture.glow > 0 || capture.green > 0) ? (
				<div
					style={{
						position: "absolute",
						inset: "-8px -10px",
						borderRadius: 6,
						backgroundColor: `rgba(51, 180, 255, ${0.16 * capture.glow})`,
						boxShadow: `inset 0 0 0 999px rgba(34, 197, 94, ${0.13 * capture.green})`,
						pointerEvents: "none",
					}}
				/>
			) : null}
			<Bar w={`${55 + (seed % 3) * 8}%`} h={9} op={0.55} color={COLORS.textTertiary} r={4} />
			<Bar w="42%" h={16} op={0.7} color={COLORS.text} r={5} />
		</div>
		<div style={{height: 4}} />
		{[0, 1, 2, 3].map((i) => (
			<Bar key={i} w={`${seededPct(seed, i, 84, 26)}%`} h={5} op={0.3} />
		))}
		<div style={{flex: 1}} />
		<div
			style={{
				height: 28,
				borderRadius: 6,
				border: `1px solid ${COLORS.borderMuted}`,
				opacity: 0.7,
			}}
		/>
	</div>
);

/** Classic arrow cursor (the session's "hands"). */
const Cursor: React.FC<{x: number; y: number; opacity: number}> = ({x, y, opacity}) => (
	<svg
		width={26}
		height={26}
		viewBox="0 0 24 24"
		style={{position: "absolute", left: x, top: y, opacity, pointerEvents: "none"}}
	>
		<path
			d="M5 2 L5 19 L9.4 15.2 L12 21.2 L14.8 20 L12.2 14.1 L18 13.6 Z"
			fill="#ffffff"
			stroke="#1b1b1b"
			strokeWidth="1.4"
			strokeLinejoin="round"
		/>
	</svg>
);

/**
 * The viewport, positioned by `fold`: 0 = full VIEW_RECT, 1 = exactly rail
 * slot 4. Interior is designed at VIEW_W×VIEW_H and uniformly scaled, so
 * the landed state IS the evidence card (continuity by construction).
 */
export const SessionViewport: React.FC<{state: ViewportState}> = ({state}) => {
	const {reveal = 1, page = 0, cursor, ripples = [], captures = [], fold = 0} = state;
	if (reveal <= 0) return null;
	const target = slotRect(3);
	const fx = interpolate(fold, [0, 1], [VIEW_RECT.x, target.x]);
	const fy = interpolate(fold, [0, 1], [VIEW_RECT.y, target.y]);
	const k = interpolate(fold, [0, 1], [1, CARD_W / VIEW_W]);
	const pageDip = Math.min(1, Math.abs(page - 0.5) * 4);
	const isPricing = page >= 0.5;
	return (
		<div
			style={{
				position: "absolute",
				left: fx,
				top: fy - 30 * (1 - reveal),
				width: VIEW_W * k,
				height: VIEW_H * k,
				opacity: Math.min(1, reveal * 1.3),
			}}
		>
			<div
				style={{
					width: VIEW_W,
					height: VIEW_H,
					transform: `scale(${k})`,
					transformOrigin: "top left",
					backgroundColor: COLORS.surface2,
					border: `1px solid ${COLORS.border1}`,
					borderRadius: 8 / Math.max(k, 0.001),
					boxSizing: "border-box",
					overflow: "hidden",
					boxShadow: fold < 0.5 ? "0 16px 48px rgba(0,0,0,0.35)" : "none",
				}}
			>
				{/* Chrome bar: traffic lights + URL pill + the tool's identity chip */}
				<div
					style={{
						height: CHROME_H,
						backgroundColor: COLORS.surface3,
						borderBottom: `1px solid ${COLORS.border}`,
						display: "flex",
						alignItems: "center",
						padding: "0 18px",
						gap: 8,
					}}
				>
					<div style={{width: 11, height: 11, borderRadius: 99, backgroundColor: "#ff5f57"}} />
					<div style={{width: 11, height: 11, borderRadius: 99, backgroundColor: "#febc2e"}} />
					<div style={{width: 11, height: 11, borderRadius: 99, backgroundColor: "#28c840"}} />
					<div
						style={{
							marginLeft: 14,
							flex: 1,
							maxWidth: 320,
							height: 24,
							borderRadius: 12,
							backgroundColor: COLORS.surface1,
							border: `1px solid ${COLORS.border}`,
							display: "flex",
							alignItems: "center",
							paddingLeft: 12,
						}}
					>
						<Bar w={150} h={6} op={0.35} />
					</div>
					<div style={{flex: 1}} />
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 7,
							background: BROWSER_USE_COLOR,
							border: `1px solid ${COLORS.border1}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<BrowserUseGlyphW size={17} />
					</div>
				</div>

				{/* Page area */}
				<div
					style={{
						position: "relative",
						height: VIEW_H - CHROME_H - 2,
						backgroundColor: COLORS.surface1,
						opacity: pageDip,
					}}
				>
					{!isPricing ? (
						// Page A — a landing wireframe
						<div style={{padding: "26px 32px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box"}}>
							<div style={{display: "flex", alignItems: "center", gap: 18}}>
								<div style={{width: 16, height: 16, borderRadius: 4, backgroundColor: COLORS.textMuted, opacity: 0.55}} />
								<div style={{flex: 1}} />
								{[0, 1, 2].map((i) => (
									<Bar key={i} w={44} h={7} op={0.35} />
								))}
								{/* the Pricing nav item — the cursor's first target */}
								<Bar w={52} h={7} op={0.55} color={COLORS.textTertiary} />
							</div>
							<div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14}}>
								<Bar w={330} h={13} op={0.55} color={COLORS.textTertiary} r={5} />
								<Bar w={230} h={13} op={0.35} r={5} />
								<div style={{height: 8}} />
								<div style={{width: 120, height: 32, borderRadius: 7, border: `1px solid ${COLORS.borderMuted}`, opacity: 0.7}} />
							</div>
						</div>
					) : (
						// Page B — the pricing page ("go to the pricing page and collect
						// every plan name and monthly price" — the registry's own task)
						<div style={{padding: "22px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, height: "100%", boxSizing: "border-box"}}>
							<Bar w={190} h={9} op={0.5} color={COLORS.textTertiary} r={4} />
							<div style={{display: "flex", gap: 22}}>
								{[0, 1, 2].map((i) => (
									<PlanCard key={i} seed={i + 2} capture={captures[i]} />
								))}
							</div>
						</div>
					)}

					{/* click ripples */}
					{ripples.map((rp, i) => {
						if (rp.p <= 0 || rp.p >= 1) return null;
						const r = 6 + 26 * rp.p;
						return (
							<div
								key={i}
								style={{
									position: "absolute",
									left: rp.x - r,
									top: rp.y - r,
									width: r * 2,
									height: r * 2,
									borderRadius: 999,
									border: `2.5px solid rgba(51, 180, 255, ${0.9 * (1 - rp.p)})`,
									pointerEvents: "none",
								}}
							/>
						);
					})}

					{/* the hands */}
					{cursor && cursor.opacity > 0 ? <Cursor {...cursor} /> : null}
				</div>
			</div>
		</div>
	);
};

// ---------------------------------------------------------------------------
// The Rig — chain + rail, the whole set piece. Scenes pass state only.
// ---------------------------------------------------------------------------

export type RigProps = {
	start?: BlockVis;
	agent?: BlockVis;
	response?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** 0..1 — Tools row reveal on the agent (scene 2 grows it in). */
	toolsReveal?: number;
	/** 0..1 — the chips' second wrap line ("Browser Use" owns it). */
	toolsWrapReveal?: number;
	chips?: {exa?: ChipVis; firecrawl?: ChipVis; browser?: ChipVis};
	/** Row glows (being read). */
	inputGlow?: number;
	msgGlow?: number;
	respGlow?: number;
	/** The four evidence cards, in call order. */
	cards?: [CardVis, CardVis, CardVis, CardVis];
};

const NO_CARD: CardVis = {reveal: 0};

export const Rig: React.FC<RigProps> = ({
	start,
	agent,
	response,
	edge1,
	edge2,
	toolsReveal = 0,
	toolsWrapReveal = 1,
	chips = {},
	inputGlow = 0,
	msgGlow = 0,
	respGlow = 0,
	cards = [NO_CARD, NO_CARD, NO_CARD, NO_CARD],
}) => {
	const tools: SimBlockTool[] = [
		{
			name: "Exa",
			color: EXA_COLOR,
			glyph: <ExaGlyphW size={12} />,
			ring: chips.exa?.ring ?? 0,
			opacity: chips.exa?.reveal ?? 1,
		},
		{
			name: "Firecrawl",
			color: FIRECRAWL_COLOR,
			glyph: <FirecrawlGlyph size={13} />,
			ring: chips.firecrawl?.ring ?? 0,
			opacity: chips.firecrawl?.reveal ?? 1,
		},
		{
			name: "Browser Use",
			color: BROWSER_USE_COLOR,
			glyph: <BrowserUseGlyphW size={13} />,
			ring: chips.browser?.ring ?? 0,
			opacity: chips.browser?.reveal ?? 1,
			// Owns the wrap line — reveals by fade so it never jumps lines.
			fade: true,
		},
	];

	return (
		<>
			<CanvasDots />
			<ChainEdge i={0} {...edge1} />
			<ChainEdge i={1} {...edge2} />

			{/* Start */}
			<div style={{position: "absolute", left: blockX(0), top: CHAIN_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					rows={[{title: "Input", value: "Competitor", glow: inputGlow}]}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>

			{/* Research — the agent with hands */}
			<div style={{position: "absolute", left: blockX(1), top: CHAIN_Y, opacity: visOpacity(agent)}}>
				<SimBlock
					name="Research"
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{
							title: "Messages",
							value: (
								<>
									{"Research "}
									<Tag text="<start.input>" glow={msgGlow} />
								</>
							),
						},
						{title: "Model", value: "claude-sonnet-4-6"},
					]}
					tools={toolsReveal > 0 ? tools : []}
					toolsReveal={toolsReveal}
					toolsWrapReveal={toolsWrapReveal}
					highlighted={agent?.highlighted}
					state={agent?.state}
				/>
			</div>

			{/* Response */}
			<div
				style={{position: "absolute", left: blockX(2), top: CHAIN_Y, opacity: visOpacity(response)}}
			>
				<SimBlock
					name="Response"
					color={BLOCK_COLORS.response}
					glyph={<ResponseGlyphW size={22} />}
					rows={[
						{
							title: "Data",
							value: (
								<>
									{'{ "brief": '}
									<Tag text="<research.content>" glow={respGlow} />
									{" }"}
								</>
							),
						},
					]}
					hideSourceHandle
					highlighted={response?.highlighted}
					state={response?.state}
				/>
			</div>

			{/* The evidence rail */}
			<SearchCard slot={0} vis={cards[0]} />
			<PageCard slot={1} vis={cards[1]} seed={4} />
			<PageCard slot={2} vis={cards[2]} seed={9} />
			{cards[3].hidden || (cards[3].reveal ?? 0) <= 0 ? null : (
				<div style={{opacity: (1 - 0.65 * (cards[3].dim ?? 0)) * Math.min(1, (cards[3].reveal ?? 0) * 1.4)}}>
					<SessionViewport state={SESSION_FINAL} />
					{(cards[3].glow ?? 0) > 0 || (cards[3].pulse ?? 0) > 0 ? (
						<div
							style={{
								position: "absolute",
								left: slotRect(3).x,
								top: slotRect(3).y,
								width: CARD_W,
								height: CARD_H,
								borderRadius: 8,
								backgroundColor: `rgba(51, 180, 255, ${0.08 * (cards[3].glow ?? 0)})`,
								boxShadow: `inset 0 0 0 2.5px rgba(51, 180, 255, ${0.85 * (cards[3].glow ?? 0)}), inset 0 0 0 2.5px rgba(34, 197, 94, ${0.9 * (cards[3].pulse ?? 0)})`,
								pointerEvents: "none",
							}}
						/>
					) : null}
				</div>
			)}
		</>
	);
};

// Re-export theme bits scenes need alongside the rig.
export {usePalette};
