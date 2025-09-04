form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  // adiciona a mensagem do usuário
  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        metadata: {
          channel: "web-chat-ui",
          userId: "test-user-123",
        },
      }),
    });

    const data = await res.json();

    // EXTRAIR APENAS O TEXTO DA RESPOSTA - AQUI ESTÁ O AJUSTE
    let botResponse = "";
    
    // Verifica diferentes formatos possíveis de resposta
    if (data.output) {
      botResponse = data.output; // Se vier no formato {"output": "texto"}
    } else if (data.reply) {
      botResponse = data.reply; // Se vier no formato {"reply": "texto"}
    } else if (data.response) {
      botResponse = data.response; // Se vier no formato {"response": "texto"}
    } else if (data.text) {
      botResponse = data.text; // Se vier no formato {"text": "texto"}
    } else if (typeof data === "string") {
      botResponse = data; // Se for direto uma string
    } else {
      // Se não reconhecer o formato, mostra o JSON completo (para debugging)
      botResponse = JSON.stringify(data);
    }

    // mostra no chat APENAS O TEXTO
    addMessage(botResponse, "bot");

    // mostra no painel lateral o JSON COMPLETO (para debugging)
    rawResponse.textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    addMessage("Erro: " + err.message, "bot");
    rawResponse.textContent = err.message;
  }
});