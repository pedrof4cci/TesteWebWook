export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    // URL do seu webhook n8n
    const n8nWebhook = "https://pedrohen.app.n8n.cloud/webhook-test/7e358e31-9ff3-45ed-ba40-e93c0a2ec920";

    const response = await fetch(n8nWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const botMessage = data.message; // pega apenas a mensagem
    addBotMessage(botMessage);


    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
