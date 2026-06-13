# on-call-v2 — narration v1

Register: clean condensed prose that explains what the viewer is seeing
(gold = knowledge-base OG script). The TRUE framing carries throughout:
the agent READS the signals and CREATES records — a diagnosis, a ticket,
a page. Nothing on screen or in the narration claims an edit, a fix, or
a redeploy.

## 1. the-queue — min 11s

It's three in the morning, and six incidents are firing at once. Each
one needs the same first response: a diagnosis, a ticket, and a page to
the engineer on call.

## 2. the-responder — min 19s

You can build that first response as a single workflow. A webhook
receives each alert, a Triage agent reads the monitoring stack — its
tools are Sentry, Datadog, and GitHub — and three integrations carry its
findings out: Slack, Linear, and PagerDuty.

## 3. alert-in — min 12s

The first alert arrives — row three, the 500s on the payments API. The
webhook hands the message to the agent, and Sim starts recording the
run.

## 4. reading-the-signals — min 13s

The agent investigates the way an engineer would: it pulls the Sentry
issue, queries the surrounding logs in Datadog, and checks the latest
commit on GitHub. Each call is a read, and each one lands in the run
record as it happens.

## 5. creating-the-records — min 15s

Then the agent creates the records: it posts the diagnosis to Slack,
opens a ticket in Linear, and creates a PagerDuty incident that pages
the engineer on call. In the queue, row three flips from firing to
triaged to assigned.

## 6. the-queue-drains — min 16s

A webhook delivers one alert per run, so the remaining five alerts each
get the same treatment. Run after run, the agent reads the signals,
creates the records, and another row flips to assigned — until the
status column has drained.

## 7. morning — min 8s

By morning, every incident has an owner and a ticket. Everything the
agent did was a read or a new record, and the log shows exactly what
happened overnight, run by run.
