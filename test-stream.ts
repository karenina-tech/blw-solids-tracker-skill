async function runAgnosticTest() {
  console.log("📡 Enviando datos de onboarding directamente a la API REST...");

  const payload = {
    profile: {
      babyName: "Odiel",
      ageMonths: 7,
      startDate: "2026-05-19",
      dietaryPattern: "Standard",
      hasAllergies: false,
      milestones: {
        headControl: true,
        canSitWithMinimalSupport: true,
        reachAndGrab: true,
        showsInterestInFood: true
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/tools/get-safe-foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("\n✅ Respuesta Determinista del Backend (JSON Estándar):");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n🧲 Revisa la raíz de tu proyecto: ¡El archivo 'BLW_Fridge_Checklist.html' ha sido generado!");
  } catch (error) {
    console.error("❌ Error en la conexión:", error);
  }
}

runAgnosticTest();