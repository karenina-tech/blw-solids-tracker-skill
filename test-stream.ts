// test-stream.ts
import dotenv from 'dotenv';
dotenv.config();

async function runLocalTest() {
  console.log("📡 Injecting synthetic payload into Fastify core...");
  
 const payload = {
  messages: [
    {
      role: "user",
      content: "Santi has 7 months, lives in Spain, has no allergies, and satisfies all physical readiness markers like sitting with minimal support, good head control, and grab mechanics."
    },
    {
      role: "assistant",
      content: "What calendar date would you like to begin introducing solids? (Format: YYYY-MM-DD, or just tell me \"today\")"
    },
    {
      role: "user",
      content: "Today"
    },
    {
      role: "assistant",
      content: "Which dietary pattern does your household follow for Santi?\n\n- `[A] Standard` (Includes meat, fish, eggs, dairy)\n- `[B] Vegetarian` (Excludes meat/fish, includes eggs/dairy)\n- `[C] Vegan` (Excludes all animal products)"
    },
    {
      role: "user",
      content: "We follow option [A] Standard"
    },
    {
      role: "assistant",
      content: "Does Santi lean forward or watch you intently when you are eating? `[Y / N]`"
    },
    {
      role: "user",
      content: "Y"
    },
  ]
};

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("\n✅ Backend Runtime Response Stream:\n");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Test pipeline dropped:", error);
  }
}

runLocalTest();