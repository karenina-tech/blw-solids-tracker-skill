# 🥑 BLW Solids Tracker — HTTP Skill Server

## Motivation

Starting complementary feeding can be overwhelming for first-time parents, especially when implementing the Baby-Led Weaning (BLW) method.

This tool helps parents track the introduction of solid foods in a safe, suggested order. It places special emphasis on tracking **potentially allergenic foods**. By using this tool, parents gain peace of mind and clear visibility into which foods have been offered, which were rejected, and which caused allergic reactions.

<details>
  <summary>📸 Click to view the printable PDF design templates</summary>
  <br>
  <p><strong>Header & Intro:</strong></p>
  <img src="./assets/preview-header.png" alt="Header" width="500px">
  <br><br>
  <p><strong>30-Day Tracking Table and Footer:</strong></p>
  <img src="./assets/preview-footer.png" alt="Table Rows" width="500px">
</details>

## 👨‍👩‍👧 Not a developer?

If you just want to generate a BLW checklist for your baby — no setup, no AI subscription, no server — use the companion web app instead:

**[blw-solids-tracker-web](https://github.com/KareninaTech/blw-solids-tracker-web)** — open the link, fill in a short form, and download your personalised 30-day checklist. Free, open source, runs entirely in the browser.

---

## Concept

An **agent-agnostic HTTP Skill Server**. Any AI framework (LangChain, Vercel AI SDK, AutoGen, or a custom agent) can connect to it via standard HTTP and JSON Schema.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`.

---

## ✨ Key Features

- **Agent-agnostic HTTP surface:** Any framework that can read JSON Schema and make HTTP calls works out of the box.
- **Independent Safety Gates:** Every tool validates its own data automatically. The server never assumes a previous step was completed, ensuring maximum safety.
- **Formula exception at 5 months:** Babies on formula can start early if they pass all physical milestones, matching official pediatric guidance.
- **Diet and allergen filtering:** The food dataset is filtered by dietary preference (standard / vegetarian / vegan) and any declared allergens before the plan is built.
- **Printable 30-day checklist:** On approval, a `BLW_Fridge_Checklist.html` is generated automatically and served at `/api/checklist`.

---

## 🤖 Connecting Your Agent

Any agent that can make HTTP calls needs only two endpoints to fully bootstrap:

| Endpoint | Purpose |
|---|---|
| `GET /api/prompt` | Returns the orchestrator system prompt with today's date injected. Paste the returned `prompt` field directly as your agent's system prompt. |
| `GET /api/tools` | Returns every tool's name, description, JSON Schema, and `endpoint` URL. Register each entry as a callable function in your agent framework. |

The `endpoint` field in each tool definition tells your agent exactly where to POST — no manual wiring needed. The response is in OpenAI/Anthropic function-calling format, so most frameworks consume it directly.

```
# One-time setup for any agent (Hermes, LangChain, AutoGen, custom…)

1. GET /api/prompt  →  use returned { prompt } as system prompt
2. GET /api/tools   →  register each tool using its name, schema, and endpoint
3. Start chatting   →  agent follows the prompt, calls tools, server responds
```

No SDK. No API key on the server. No configuration beyond pointing at `http://localhost:3000`.

---

## 🔌 How Agent Integration Works

### Step 1 — Agent discovers the skill

```
GET /api/tools
```

Returns the full skill contract: available commands, tool names, endpoint URLs, and JSON Schema definitions for every parameter the agent needs to collect.

```json
{
  "name": "blw-solids-tracker-skill",
  "commands": [{ "name": "blw-tracker", "endpoint": "/api/commands/blw-tracker" }],
  "tools": [{ "name": "getSafeFoods", "endpoint": "/api/tools/get-safe-foods", "parameters": { "..." } }]
}
```

### Step 2 — Agent initializes the flow

```
POST /api/commands/blw-tracker
```

Returns the first message. After this, the AI agent talks to the user on its own and doesn't call the server again until the profile is completely finished.

### Step 3 — Agent collects the profile through conversation 🗣️

The agent asks the user naturally, guided by the JSON Schema from step 1:

| Field | Description |
|---|---|
| 👶 Name | Baby's first name |
| 🗓️ Age | Age in months (6+, or 5 if on formula) |
| 🍼 Feeding type | `formula` or `exclusive_breastfeeding` — required when age is 5 months |
| 📅 Start date | Planned BLW start date (YYYY-MM-DD) |
| 🥦 Diet type | `standard`, `vegetarian`, or `vegan` |
| ⚠️ Allergies | Known or suspected food allergies + which foods |
| ✅ Milestones | Head control, sits with support, grabs objects, shows interest in food |

### Step 4 — Agent checks readiness

```
POST /api/tools/validate-age
Body: { "ageMonths": 6, "developmentalMilestones": { ... }, "feedingType"?: "formula" }
```

Returns `APPROVED`, `BLOCKED_NOT_READY`, or `REQUIRES_FEEDING_TYPE` (when age is 5 and feeding type was not provided). If blocked, the agent surfaces the reason to the parent and stops.

### Step 5 — Agent executes the food plan

```
POST /api/tools/get-safe-foods
Body: { "profile": { ... } }
```

The server re-validates the full profile, runs all safety logic independently, and returns the food plan + the 30-day schedule. If approved, a printable `BLW_Fridge_Checklist.html` is saved automatically and a `checklistUrl` is included in the response. 🖨️

### Step 6 — Agent fetches preparation guidance

```
POST /api/tools/get-choking-hazards
Body: { "ageMonths": 6 }
```

Returns age-appropriate preparation instructions and choking hazard warnings for every food in the dataset. The agent uses this alongside the food plan to give parents safe handling guidance.

---

## 📋 Response statuses

| `safetyStatus` | Meaning |
|---|---|
| `APPROVED` | Baby is ready — food plan + 30-day schedule + HTML checklist generated |
| `BLOCKED_NOT_READY` | Age or milestones not met — agent surfaces the warning to the parent |
| `REQUIRES_FEEDING_TYPE` | Baby is 5 months old — agent must ask whether they are on formula or exclusively breastfed before proceeding |

---

## 🛠️ Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the server in watch mode (auto-restarts on file changes) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm test` | Run all gate tests with Vitest |
| `npm run types` | Type-check without emitting — fails on any TypeScript error |
| `npm run validate:dataset` | Validate the food dataset against its schema |

---

## ⚠️ Safety notice

- This tool does **not** replace professional medical advice.
- Always consult your pediatrician before starting solids.
- Never leave your baby unattended while eating.
- Prepare all foods in an **age-appropriate size and texture** to prevent choking.
