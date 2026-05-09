# Clarity Copilot — quick reference

> Microsoft's Generative-AI chat over your Clarity project data. Lives inside the Clarity dashboard, not on the site.

**Source:** <https://learn.microsoft.com/en-us/clarity/copilot/clarity-copilot-chat>

---

## Where it lives

`clarity.microsoft.com` → project → **Dashboard** → **Copilot** icon (top right).

Nothing to ship on x9elysium.com. The only prerequisite is "tracking code installed" — already done via [`app/components/ClarityTracker.tsx`](../../app/components/ClarityTracker.tsx) and the inline snippet in [`app/layout.tsx`](../../app/layout.tsx).

## What Copilot can answer

Per Microsoft's own scope note: chat is grounded in **dashboard data only**. It cannot:

- Link to specific Recordings or Heatmaps.
- Reason about page design, copy, or layout.
- Share or download the conversation.

So treat it as a faster filter UI, not an analyst.

## What we track (so you can ask precise questions)

The custom tracker fires the events and tags below. Reference these by name when prompting Copilot — vague prompts return vague answers.

### Page-section events

`page_view`, `contact_page_view`, `chat_page_view`, `services_view`, `work_view`, `location_view`, `careers_view`, `blog_view`, `docs_view`, `about_view`, `foundation_view`, `platform_compare_view`.

### Engagement events

`scroll_25`, `scroll_50`, `scroll_75`, `scroll_100`, `time_15s`, `time_30s`, `time_60s`, `time_120s`, `time_300s`, `deep_engagement` (60s + 75% scroll), `exit_intent`, `tab_hidden`, `tab_visible`.

### Friction signals

`rage_click`, `dead_click`, `js_error`, `promise_rejection`, `network_offline`.

### Intent signals

`mailto_click`, `tel_click`, `external_link_click`, `copy_text`, `print_attempt`, `shortcut_print`, `shortcut_find`, `shortcut_save`, `cta_<label>` (from any `data-track-cta` attribute).

### Custom tags

`current_path`, `section`, `recent_paths`, `first_path`, `last_cta`, `last_cta_location`, `last_external`, `last_copy_size`, `viewport`.

### Upgraded sessions (auto-recorded in full)

`rage_click`, `mailto_click`, `tel_click`, `deep_engagement`, `exit_intent`.

## Prompts that work

- "Show sessions where `rage_click` fired on `/contact`."
- "Which `section` tag has the highest `deep_engagement` rate?"
- "Compare `exit_intent` frequency between mobile and desktop `viewport`."
- "How many sessions fired `cta_book_call` but not `mailto_click`?"
- "What's the average time to `scroll_75` on `/services` vs `/platforms`?"
- "Sessions with `js_error` on `/chat` in the last 7 days."
- "Top `last_external` hostnames after a `services_view`."

## Limitations to remember

- Generative AI; will sometimes confabulate. Cross-check filter results in the dashboard before quoting.
- No deep-link to a Recording — copy filters, click Recordings tab manually.
- Dashboard data only — no awareness of our content, copy, or design.
