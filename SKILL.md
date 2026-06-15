# Skill: BLW Solids Tracker

This file is a complete, self-contained runbook. If you are an agent that can run shell commands and make HTTP requests, follow every step in order and you will have the skill running end to end — the user does not need to do anything else.

**Required capabilities:** shell access (to clone and run the server) and HTTP (to call the tools). If you cannot run shell commands, you cannot host the server yourself — see the **Connect your agent** section of the [README](./README.md) for HTTP-only and SDK integrations instead.

---

## 1. Before you start

Make sure the host machine has:

- **Node.js** v18 or higher (`node -v` to check)
- **npm** v9 or higher (`npm -v` to check)
- No API keys or external services needed — this skill is self-contained

---

## 2. Get the code

If you don't already have the project locally, clone it first:

```bash
git clone https://github.com/karenina-tech/blw-solids-tracker-skill.git
cd blw-solids-tracker-skill
```

If the user already opened this repo for you, skip to step 3.

---

## 3. Start the server

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

## 4. Connect and run the flow

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

### Start onboarding immediately

As soon as you've loaded the prompt and registered the tools, begin the flow yourself — **do not wait for any command, keyword, or trigger from the user.** Running this skill *is* the activation. The end user does not have to type anything to start.

Call:

```
POST /api/commands/blw-tracker
```

This returns your opening greeting and the first onboarding question. Send the greeting, then walk the parent through the onboarding questionnaire defined in your system prompt, asking **one question at a time** and collecting the full baby profile **before** calling any tool.

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

---

## 5. When you're done

After `getSafeFoods` returns `APPROVED`, you have completed the skill. Show the parent the 30-day plan and end with a link to the `checklistUrl`. If any safety gate blocked, show the `note` field word for word and stop. Either way, report the outcome to the user — they pasted this file expecting you to run the whole flow.
