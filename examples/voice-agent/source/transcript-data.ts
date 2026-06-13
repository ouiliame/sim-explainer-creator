// Authored transcript content for the three call panels. Carried verbatim
// from take 1 (hype/voice-agent) — the director graded this content GOOD.
//
// TRUTH CONTRACT (script-v1.md): only AGENT turns carry text, and that text
// is the registry's own initialGreeting / template placeholder language for
// the appointment-call flow — authored CONFIG the builder writes, never run
// output. HUMAN turns carry no words: they are skeleton bars (the person's
// reply is run output, never invented). The bar-length arrays are the SHAPE
// of a reply. Outcome labels are config-template words ("confirmed" /
// "rescheduled"); the table's status column shows the registry's own enum
// value `completed`. Destination numbers are skeleton-masked stand-ins.

export type LaneScript = {
	dest: string; // masked — no real toNumber invented
	outcome: string; // config-template label
	agentLines: string[]; // authored config language (registry placeholders)
	humanReplies: (number | string)[][]; // skeleton bar widths, one reply per gap
};

// Greeting + lines lifted from agentphone.ts placeholders, specialized to
// the block's own appointment-call template:
//   initialGreeting placeholder: "Hi, this is Acme Corp calling about your
//     recent order."
export const LANES: LaneScript[] = [
	{
		dest: "+1 415 ··· 4288",
		outcome: "confirmed",
		agentLines: [
			"Hi, this is Acme calling to confirm your appointment for tomorrow.",
			"Great — you're all set for 3 PM. We'll see you then.",
		],
		humanReplies: [["62%", "40%"]],
	},
	{
		dest: "+1 628 ··· 1924",
		outcome: "rescheduled",
		agentLines: [
			"Hi, this is Acme calling to confirm your appointment for tomorrow.",
			"No problem — I've moved you to Thursday at 11. You're confirmed.",
		],
		humanReplies: [["54%", "70%", "34%"]],
	},
	{
		dest: "+1 917 ··· 7706",
		outcome: "confirmed",
		agentLines: [
			"Hi, this is Acme calling to confirm your appointment for tomorrow.",
			"Perfect — confirmed for 3 PM. Thanks, and have a good day.",
		],
		humanReplies: [["48%", "58%"]],
	},
];

/** The outcomes table rows (to / outcome / status). `status` = the
 *  registry's own enum word; see truth contract. */
export const TABLE_ROWS_DATA = LANES.map((l) => [l.dest, l.outcome, "completed"]);
