# Skill: BLW Solids Tracker

This document tells you — the agent — how to start this skill server and connect to it. Follow each step in order.

---

## 1. Prerequisites

Before you run anything, make sure the host machine has:

- **Node.js** v18 or higher (`node -v` to check)
- **npm** v9 or higher (`npm -v` to check)
- No API keys or external services needed — this skill is self-contained

---

## 3. Server Initialization

Run these commands in the project root to start the server:

```bash
npm install
npm run dev
```

The server will be listening at `http://localhost:3000`.

If port 3000 is taken, set a different one before starting:

```bash
PORT=8080 npm run dev
```

Once you see `🥑 BLW Solids Tracker running at http://localhost:<port>`, the skill is ready to receive requests.

---

## 4. Agent Integration

### Bootstrap — do this once before anything else

**Load your system prompt:**

```
GET /api/prompt
```

Take the value of the `prompt` field and set it as your system prompt. This tells you exactly how to run the onboarding flow and which tools to call in the right order.

**Register your tools:**

```
GET /api/tools
```

This returns every tool available in this skill — name, description, the full JSON Schema for each parameter, and the exact endpoint URL to POST to. Register each entry as a callable function in your framework.

---

### Starting the flow

When the user triggers the `blw-tracker` command, call:

```
POST /api/commands/blw-tracker
```

You will receive the first message to send the user and the instruction to begin the onboarding questionnaire. Collect the full baby profile through conversation **before** calling any tool.

---

### Tools

Every tool response includes a `success` boolean and a `safetyStatus` string. Always check `safetyStatus` to decide what to do next.

---

#### `POST /api/tools/validate-age`

Call this right after you collect the baby's age. It is an early safety gate — if it blocks, stop immediately and show the parent the exact text from the `note` field. Do not proceed to `getSafeFoods`.

**Example request:**

```json
{
  "ageMonths": 6,
  "developmentalMilestones": {
    "headControl": true,
    "canSitWithMinimalSupport": true,
    "reachAndGrab": true,
    "showsInterestInFood": false
  }
}
```

When `ageMonths` is `5`, include `feedingType`:

```json
{
  "ageMonths": 5,
  "feedingType": "formula",
  "developmentalMilestones": {
    "headControl": true,
    "canSitWithMinimalSupport": true,
    "reachAndGrab": true,
    "showsInterestInFood": true
  }
}
```

**What to do with the response:**

| `safetyStatus` | What it means | Your next action |
|---|---|---|
| `APPROVED` | Age is valid | Continue the flow |
| `BLOCKED_NOT_READY` | Baby is too young | Show the `note` field word for word. Stop. |
| `REQUIRES_FEEDING_TYPE` | Baby is 5 months — feeding type is missing | Ask the parent: formula or exclusive breastfeeding? Then call `validateAge` again with `feedingType` set |

---

#### `POST /api/tools/get-safe-foods`

Call this after you have collected the full baby profile. The server re-checks readiness, filters foods by age, diet type, and any declared allergies, generates the 30-day introduction plan, and writes the printable HTML checklist.

**Example request:**

```json
{
  "profile": {
    "name": "Sofia",
    "ageMonths": 6,
    "startDate": "2025-09-01",
    "dietType": "standard",
    "knownAllergies": true,
    "allergicFoods": ["peanut", "egg"],
    "developmentalMilestones": {
      "headControl": true,
      "canSitWithMinimalSupport": true,
      "reachAndGrab": true,
      "showsInterestInFood": false
    }
  }
}
```

Include `feedingType` only when `ageMonths` is `5`. Include `allergicFoods` only when `knownAllergies` is `true`.

**When you get `safetyStatus: "APPROVED"`:**

- If the response contains a `foodInterestNote` field, show it as a standalone paragraph before the checklist.
- Build the 30-day table using the `plan` array. Do not add or invent any food not present in the list.
- End your message with a markdown link to the `checklistUrl` value so the parent can open or print the full checklist.

**When you get `safetyStatus: "BLOCKED_NOT_READY"`:**

- Show the `note` field word for word. Do not paraphrase or shorten it.
- Do not generate a checklist or food calendar.

---

#### `POST /api/tools/get-choking-hazards`

Call this after `getSafeFoods` to give parents safe food preparation instructions matched to the baby's age.

**Example request:**

```json
{
  "ageMonths": 6
}
```

Include `feedingType` when `ageMonths` is `5`.

**Example response:**

```json
{
  "success": true,
  "ageMonths": 6,
  "preparationRules": [
    {
      "id": "apple",
      "name": "Apple",
      "preparation": "Strictly steamed or baked until completely fork-tender. Never raw.",
      "chokingHazardWarning": "Raw apple pieces or hard chunks are a severe, high-risk choking hazard."
    }
  ]
}
```

---

#### `GET /api/checklist`

Serves the last generated checklist as a self-contained HTML file. The `checklistUrl` returned by `getSafeFoods` points here. Tell the parent they can open it in any browser and use **File → Print** to save it as a PDF.

---

### Error responses

When a request fails, you will always receive:

```json
{
  "success": false,
  "error": "BAD_REQUEST",
  "message": "Missing required field: profile within request body."
}
```

Check `success: false` to detect errors uniformly across all tools.
