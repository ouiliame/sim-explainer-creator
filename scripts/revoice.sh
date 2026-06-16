#!/usr/bin/env bash
# revoice.sh <voice_id> <slug...>
# Re-synth narration with a new voice + re-render, per scc10 worktree. Visuals untouched.
# William's voice = QRGnSWaTwVtMYh87riV0 ; Jony = M5lSFiV8wa1aYNbadPOy
set -u
VOICE="$1"; shift
WTROOT=/Users/william/sim/scc10-worktrees
DEST=/Users/william/Desktop/SIM-VIDEOS/agentic-system-design-william
mkdir -p "$DEST"
for slug in "$@"; do
  WT="$WTROOT/$slug"
  NAR="src/videos/$slug/narration-v1.md"
  if [ ! -f "$WT/$NAR" ]; then echo "skip $slug (no narration yet)"; continue; fi
  echo "=== revoice $slug -> $VOICE ==="
  ( cd "$WT" && bun scripts/vo-sync.ts --comp "$slug" --narration "$NAR" --voice "$VOICE" && bun run render "$slug" ) \
    || { echo "FAIL $slug"; continue; }
  src=$(ls "$WT/out/$slug-1080.mp4" "$WT/out/$slug.mp4" 2>/dev/null | head -1)
  [ -n "$src" ] && cp "$src" "$DEST/$slug.mp4" && echo "copied $slug (william)"
done
echo "revoice batch done"
