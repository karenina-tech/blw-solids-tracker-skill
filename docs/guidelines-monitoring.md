# Medical Guidelines Monitoring

This document explains how the BLW Solids Tracker automatically checks for updates to the medical guidelines it relies on, and what to do when a change is detected.

---

## Why this exists

The skill gives advice based on official medical guidelines from the WHO and the AAP. Those guidelines can change over time. If they change and the skill is not updated, it could give parents outdated or unsafe advice.

This monitoring system checks the source websites every 2 months and sends an alert if anything looks different — so you always know when to review.

---

## How it works

```
Every 2 months (GitHub Actions cron job)
        │
        ▼
Visit each medical source URL
        │
        ▼
Create a short "snapshot" of the page text (SHA-256 hash)
        │
        ├── Snapshot is the same as last time → OK, do nothing
        │
        └── Snapshot is different → open a GitHub Issue with step-by-step instructions
```

The system does **not** change anything automatically. It only sends an alert. A human reviews the change and decides whether to update `guidelines.json`.

---

## Files involved

| File | What it is |
|---|---|
| `guidelines.json` | The single file that holds all the medical rules the skill uses |
| `monitoring/sources.json` | The list of URLs and medical papers to check |
| `monitoring/baseline-hashes.json` | The saved snapshots from the last review |
| `monitoring/monitor-guidelines.cjs` | The script that does the checking |
| `.github/workflows/monitor-guidelines.yml` | The schedule that runs the script automatically |

---

## The rules file — `guidelines.json`

All validation logic in the skill reads from this one file. If the WHO or AAP changes a rule, you only need to edit this file — no code changes required.

```json
{
  "_meta": {
    "version": "1.0.0",
    "lastReviewed": "2024-01-01"
  },
  "ageRules": {
    "standardMinimumMonths": 6,
    "earlyWindowMonths": [5],
    "earlyWindowApprovedFeedingTypes": ["formula"]
  },
  "developmentalMilestones": {
    "required": ["headControl", "canSitWithMinimalSupport", "reachAndGrab"],
    "informational": ["showsInterestInFood"]
  }
}
```

**What each field means:**

- `standardMinimumMonths` — The minimum age (in months) to start solid foods. Currently 6.
- `earlyWindowMonths` — Ages where early introduction is possible under certain conditions. Currently only age 5.
- `earlyWindowApprovedFeedingTypes` — Which feeding types allow early introduction at those ages. Currently only `formula`.
- `required` — The physical milestones a baby must have before starting solids. All three must be true.
- `informational` — Milestones that are collected but do not block approval. Currently only food interest.

---

## What happens when a change is detected

GitHub Actions opens an Issue in this repository. It looks like this:

> **[Guidelines Monitor] Medical source changed — please review**

The issue includes a step-by-step checklist in plain English. You will also receive a notification by email if you watch this repository.

---

## Step-by-step: how to handle an alert

### Step 1 — Read the source

Open `monitoring/sources.json` and visit the URL of the source that changed. Read the current version of the guidelines carefully.

Look for changes to:
- The minimum age to start solid foods
- Which physical milestones are required
- Any new allergen introduction recommendations

### Step 2 — Decide if the medical rules actually changed

Websites sometimes change their layout or navigation without changing the medical content. If the actual rules are the same, skip to Step 4.

### Step 3 — Update `guidelines.json` (only if rules changed)

Open `guidelines.json` and update the values that are now outdated.

Also update the metadata fields:

```json
"lastReviewed": "2026-08-01",
"version": "1.1.0"
```

Use today's date for `lastReviewed`. For `version`, increase the middle number by one (for example `1.0.0` → `1.1.0`).

### Step 4 — Save new snapshots

Run this command from the project root folder:

```bash
node monitoring/monitor-guidelines.cjs --update
```

This visits all sources again and saves their current state to `monitoring/baseline-hashes.json`. Commit that file to the repository.

### Step 5 — Close the issue

Once you have committed the updated files, close the GitHub Issue.

---

## Running the script manually

You can run the monitoring script at any time from the project root:

```bash
# Check all sources against the saved snapshots
node monitoring/monitor-guidelines.cjs

# Save new snapshots (use after reviewing a detected change)
node monitoring/monitor-guidelines.cjs --update
```

The script does not need any extra packages or API keys. It uses only Node.js built-in modules.

---

## The schedule

The script runs automatically on the **1st of every other month** at 09:00 UTC (January, March, May, July, September, November). You can also trigger it manually from the GitHub Actions tab at any time.

---

## Sources monitored

| Source | Type | Why it matters |
|---|---|---|
| WHO — Complementary Feeding 2023 | Webpage | Sets the global standard for minimum age and readiness |
| AAP HealthyChildren — Infant Food and Feeding 2024 | Webpage | US guidelines for allergen introduction and readiness milestones |
| AAP — Timing of Introduction of Complementary Foods (Eidelman et al., 2022) | PubMed | The journal paper behind the 5-month formula exception |

---

## What this system does NOT do

- It does not update `guidelines.json` automatically. A human always reviews first.
- It does not monitor every word on a page — only the visible text content. Minor wording changes may or may not trigger an alert.
- It does not guarantee that every possible guideline update will be caught. It is an early warning system, not a replacement for periodic manual review.
