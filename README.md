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

## 🔌 How Agent Integration Works

### 1. Agent discovers the skill

```
GET /api/tools
```

Returns the full skill contract: available commands, tool names, endpoint URLs, and JSON Schema definitions for every parameter the agent needs to collect.

```json
{
  "name": "blw-solids-tracker-skill",
  "commands": [{ "name": "blw-tracker", "endpoint": "/api/commands/blw-tracker" }],
  "tools": [{ "name": "getSafeFoods", "endpoint": "/api/tools/get-safe-foods", "parameters": { ... } }]
}
```

### 2. Agent initializes the flow

```
POST /api/commands/blw-tracker
```

Returns the first conversational prompt. From this point the agent manages the dialogue with the user entirely — no further server calls until the profile is complete.

### 3. Agent collects the profile through conversation 🗣️

The agent asks the user naturally, guided by the JSON Schema from step 1:

| Field | Description |
|---|---|
| 👶 Name | Baby's first name |
| 🗓️ Age | Age in months (min. 6) |
| 📅 Start date | Planned BLW start date (YYYY-MM-DD) |
| 🥦 Diet type | `standard`, `vegetarian`, or `vegan` |
| 📍 Location | Country/region for seasonal food availability |
| ⚠️ Allergies | Known or suspected food allergies + which foods |
| ✅ Milestones | Head control, sits with support, grabs objects, shows interest in food |

### 4. Agent executes the tool

```
POST /api/tools/get-safe-foods
Body: { "profile": { ... } }
```

The server validates the profile, runs the safety logic, and returns the food plan. If approved, a printable `BLW_Fridge_Checklist.html` is saved automatically. 🖨️

---

## 📋 Response statuses

| `safetyStatus` | Meaning |
|---|---|
| `APPROVED` | Baby is ready — food plan + HTML checklist generated |
| `BLOCKED_NOT_READY` | Age or milestones not met — agent surfaces the warning to the parent |

---

## ⚠️ Safety notice

- This tool does **not** replace professional medical advice.
- Always consult your pediatrician before starting solids.
- Never leave your baby unattended while eating.
- Prepare all foods in an **age-appropriate size and texture** to prevent choking.
