# 🥑 BLW Solids Tracker — Skill

## Motivation

Starting complementary feeding can be overwhelming for first-time parents, especially when implementing the Baby-Led Weaning (BLW) method.

This tool helps parents track the introduction of solid foods in a safe, suggested order. It places special emphasis on tracking **potentially allergenic foods**. By using this tool, parents gain peace of mind and clear visibility into which foods have been offered, which were rejected, and which caused allergic reactions.

<details>
  <summary>📸 Click to view the printable checklist design</summary>
  <br>
  <p><strong>Header & Intro:</strong></p>
  <img src="./assets/preview-header.png" alt="Header" width="500px">
  <br><br>
  <p><strong>30-Day Tracking Table and Footer:</strong></p>
  <img src="./assets/preview-footer.png" alt="Table Rows" width="500px">
</details>

---

## 👨‍👩‍👧 Not a developer?

If you just want to generate a BLW checklist for your baby — no setup, no AI subscription, no server — use the companion web app instead:

**[blw-solids-tracker-web](https://github.com/karenina-tech/blw-solids-tracker-web)** — open the link, fill in a short form, and download your personalised 30-day checklist. Free, open source, runs entirely in the browser.

---

## Concept

An **agent-agnostic HTTP Skill Server**. Any AI framework (LangChain, Vercel AI SDK, AutoGen, or a custom agent) can connect to it via standard HTTP and JSON Schema — no SDK, no API key required on the server side.

→ **To connect your agent, see [SKILL.md](./SKILL.md).**

---

## ✨ Key Features

- **Agent-agnostic:** Any framework that can read JSON Schema and make HTTP calls works out of the box.
- **Independent safety gates:** Every tool re-validates its own inputs. The server never assumes a previous step was completed.
- **Formula exception at 5 months:** Babies on formula can start early if they pass all physical milestones, matching official pediatric guidance.
- **Diet and allergen filtering:** Foods are filtered by dietary preference (standard / vegetarian / vegan) and any declared allergens before the plan is built.
- **Printable 30-day checklist:** On approval, a `BLW_Fridge_Checklist.html` is generated and served at `/api/checklist`.

---

## 🛠️ Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the server in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm test` | Run all tests |
| `npm run types` | Type-check without emitting |
| `npm run validate:dataset` | Validate the food dataset against its schema |

---

## ⚠️ Safety notice

- This tool does **not** replace professional medical advice.
- Always consult your pediatrician before starting solids.
- Never leave your baby unattended while eating.
- Prepare all foods in an **age-appropriate size and texture** to prevent choking.
