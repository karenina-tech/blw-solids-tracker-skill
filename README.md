# 🥑 BLW Solids Tracker — HTTP Skill Server

## Motivation

Starting complementary feeding can be overwhelming for first-time parents, especially when implementing the Baby-Led Weaning (BLW) method.

This tool helps parents track the introduction of solid foods in a safe, suggested order. It places special emphasis on tracking **potentially allergenic foods**. By using this tool, parents gain peace of mind and clear visibility into which foods have been offered, which were rejected, and which caused allergic reactions.

## Concept

An **agent-agnostic HTTP Skill Server**. Any AI framework — LangChain, Vercel AI SDK, AutoGen, or a custom agent — can connect to it via standard HTTP and JSON Schema. No vendor lock-in, no MCP, no dashboards.

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
- **Double-enforced safety gates:** Every tool re-validates its own preconditions independently — the server never trusts that a prior step was called.
- **Formula exception at 5 months:** Formula-fed babies who meet all physical milestones are eligible one month early, consistent with WHO/AAP guidance.
- **Diet and allergen filtering:** The food dataset is filtered by dietary preference (standard / vegetarian / vegan) and any declared allergens before the plan is built.
- **Printable 30-day checklist:** On approval, a `BLW_Fridge_Checklist.html` is generated automatically and served at `/api/checklist`.

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

Returns the first conversational prompt. From this point the agent manages the dialogue with the user entirely — no further server calls until the profile is complete.

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
