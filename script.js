const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const rawResponse = document.getElementById("raw-response");

// endpoint do proxy Netlify
const webhookUrl = "/.netlify/functions/proxy";

function addMessage(text, sender = "user") {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

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

    // mostra no chat
    addMessage(data.reply || JSON.stringify(data), "bot");

    // mostra no painel lateral
    rawResponse.textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    addMessage("Erro: " + err.message, "bot");
    rawResponse.textContent = err.message;
  }
});
