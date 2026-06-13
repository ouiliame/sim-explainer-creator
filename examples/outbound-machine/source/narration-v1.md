# Narration — outbound-machine-v1 (draft for the director to massage)

Register: the gold KB script — clean condensed prose that explains what
the viewer is seeing. Full sentences with connective tissue, the viewer
as subject where possible, product verbs (resolve, insert), calibrated
claims. No contrastives, no fragments, no trailer voice.

## 1. the-empty-table — min 8s

Here's a table in a Sim workspace, set up for an outbound campaign. It
has a column for each field, from company to status, and right now it's
empty.

## 2. the-machine — min 13s

Underneath, you build one workflow. Apollo searches for matching
companies, and its results feed a Parallel container named Enrich. The
lane inside enriches the contact, writes a personalized opener, and
creates the lead in Instantly. The chain ends in a Table block.

## 3. wired-by-reference — min 8s

One reference does the wiring: the container's items are the
organizations Apollo found, so the lane runs once for every company.

## 4. the-fan — min 10s

Start the run. When Apollo's results arrive, the parallel fans out one
copy of the lane per company, all starting at once. In the lane we'll
follow, the current item resolves to Northwind.

## 5. one-lane-one-lead — min 12s

Follow that lane. The enrichment block calls a data provider and builds
the full contact — Priya Nair, Northwind's CTO. The agent writes an
opener for her specifically, and Instantly creates the lead. The table
above is still empty.

## 6. the-scramble-finish — min 9s

The other lanes finish on their own schedule — in a parallel run, the
completion order isn't guaranteed. When the last lane lands, the fan
folds back and the container settles.

## 7. the-write-back — min 13s

The last block runs. Parallel dot results holds every lane's output,
and the Table block inserts them as rows in one batch. Each lead lands
with its enriched contact, its own opener, and a status of sent.

## 8. the-sent-campaign — min 7s

The table now holds the campaign's full record — the companies, the
contacts, six different openers, and a sent status on every row. For
the next campaign, you run the same workflow again.
