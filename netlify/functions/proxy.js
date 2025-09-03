export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    // URL do seu webhook n8n
    const n8nWebhook = "https://pedrohen.app.n8n.cloud/webhook/7e358e31-9ff3-xxxx";

    const response = await fetch(n8nWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

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
