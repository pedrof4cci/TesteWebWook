const messagesDiv = document.getElementById('message');
const input = document.getElementById('chatInput');
const form = document.getElementById('chatForm');
const lastResponsePre = document.getElementById('lastResponse');
const webhookInput = document.getElementById('webhook');

// Define o endpoint igual ao V1
webhookInput.value = '/.netlify/functions/proxy';

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML = `<div>${text}</div><div class="timestamp">${new Date().toLocaleTimeString()}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot typing';
  div.id = 'typingIndicator';
  div.textContent = '● ● ●';
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

async function sendMessage(message) {
  addMessage('user', message);
  addTyping();

  // Payload alterado para chatInput
  const payload = {
    chatInput: message,
    metadata: {
      channel: 'web-chat-ui',
      userId: 'test-user-123'
    }
  };

  try {
    const res = await fetch(webhookInput.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    lastResponsePre.textContent = JSON.stringify(data, null, 2);

    let botText = data.reply || data.output || JSON.stringify(data);

    removeTyping();
    addMessage('bot', botText);
  } catch (err) {
    removeTyping();
    addMessage('system', 'Erro: ' + err.message);
    lastResponsePre.textContent = err.toString();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendMessage(text);
});

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

function copyWebhook() {
  navigator.clipboard.writeText(webhookInput.value);
}
function clearChat() {
  messagesDiv.innerHTML = '';
  lastResponsePre.textContent = 'Nenhuma resposta ainda';
}
