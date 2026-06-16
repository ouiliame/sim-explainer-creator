# Voices

ElevenLabs voices available for narration (`vo-sync --voice <id>`). Machine-readable
list in `voices.json` at the repo root.

| name | id | notes |
|------|----|-------|
| **william** | `QRGnSWaTwVtMYh87riV0` | series default (William's own voice) |
| jony | `M5lSFiV8wa1aYNbadPOy` | prior canon (the M5lS voice) |

Add a new voice by appending name → id to `voices.json` and this table.

## Swapping a video's voice (no rebuild)

Voice is independent of the visuals. To re-voice a finished video, re-synth + re-render
— the visuals are untouched:

```bash
cd <worktree>
bun scripts/vo-sync.ts --comp <id> --narration src/videos/<id>/narration-v1.md --voice QRGnSWaTwVtMYh87riV0
bun run render <id>
```

`scripts/revoice.sh <voice-id> <slug...>` batches this across `scc10-worktrees/`.
