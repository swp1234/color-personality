# Color Choice Mixer

Seven-choice color activity at `/color-personality/`. It summarizes selections and is not a personality assessment.

## Release contract

- Ads remain suspended during the 2026-09-03 invalid-traffic restriction.
- Three spectrum confirmations and four palette choices each add one disclosed point. All eight totals are visible; ties use the listed order.
- Funnel: `color_personality_view -> start -> progress -> complete`, plus success-only `share`, `next_click`, and delegated `related_click`.
- Events contain only `event_category`; colors, scores, result, locale, URL, and timing stay private.
- Verify from the workspace root with `npm run verify:color-personality`.
