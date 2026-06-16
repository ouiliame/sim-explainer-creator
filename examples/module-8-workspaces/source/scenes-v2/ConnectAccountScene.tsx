import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {PANEL_LEFT_X, PORT_Y, PANEL_W, SERVICE_X, serviceTop, SERVICES} from "../layout-v2";
import {AccountKey, PortLines, pulse01, ramp, ServiceTile, WorkspacePanel} from "./_shared";

// Scene 4 — connect-an-account (the padlock-port metaphor, kept from v1
// review). A port grows on the boundary ring; the Google account key slides
// in from outside and is absorbed; the shackle opens, the port goes green,
// and the connection unlocks Gmail / Drive / Calendar — for everything and
// everyone inside the box. Exit state = the connected world at rest.
export const ConnectAccountScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The port introduces itself on the ring.
	const portPresence = ramp(t, 0.4, 1.2, EASING.out);

	// Services appear outside, dimmed (locked-out look = 0.65 dim).
	const serviceOp = (i: number) => ramp(t, 1.0 + i * 0.25, 1.8 + i * 0.25, EASING.out);
	const undim = ramp(t, 5.5, 6.6, EASING.out);
	const serviceDim = 0.65 * (1 - undim);

	// The Google account key: in from the outside, absorbed by the port.
	const keyIn = ramp(t, 2.8, 3.5, EASING.out);
	const keyTravel = ramp(t, 3.5, 4.4, EASING.inOut);
	const keyX = interpolate(keyTravel, [0, 1], [1300, PANEL_LEFT_X + PANEL_W + 110]);
	// Absorbed (fade + shrink complete) before overlapping the port chip.
	const keyOp = keyIn * (1 - ramp(t, 4.1, 4.4));
	const keyScale = 1 - 0.18 * keyTravel;

	// The shackle swings open; the chip goes green inside Gate.
	const open = ramp(t, 4.5, 5.3, EASING.inOut);

	// Connections draw to each service; each service blips as its line lands.
	const lineP = (i: number) => ramp(t, 5.3 + i * 0.15, 6.1 + i * 0.15, EASING.out);
	const serviceRing = (i: number) => pulse01(t, 6.0 + i * 0.15, 6.9 + i * 0.15);

	// The held identity settles inside; the tiles sweep — it's theirs now.
	const accountOp = ramp(t, 7.0, 7.8, EASING.out);
	const tilePulse = [0, 1, 2, 3].map((i) => pulse01(t, 8.2 + i * 0.14, 9.0 + i * 0.14));

	const members = [{drop: 1}, {drop: 1}, {drop: 1}];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<PortLines panelX={PANEL_LEFT_X} progress={[lineP(0), lineP(1), lineP(2)]} />

			{SERVICES.map((id, i) => {
				const op = serviceOp(i);
				if (op <= 0) return null;
				return (
					<div key={id} style={{position: "absolute", left: SERVICE_X, top: serviceTop(i), opacity: op}}>
						<ServiceTile id={id} dim={serviceDim} ring={serviceRing(i)} />
					</div>
				);
			})}

			<WorkspacePanel
				x={PANEL_LEFT_X}
				members={members}
				tilePulse={tilePulse}
				port={{presence: portPresence, open}}
				accountOp={accountOp}
			/>

			{keyOp > 0 ? <AccountKey x={keyX} y={PORT_Y} opacity={keyOp} scale={keyScale} /> : null}
		</AbsoluteFill>
	);
};
