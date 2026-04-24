// ===================================================================
// Korea RPG — AI Chatbot Helper
// Connects to Claude API (Anthropic) to answer player questions
// about Korean culture, the current mission, or anything confusing.
// ===================================================================

// ⚠️ IMPORTANT: Replace this with YOUR API key from https://console.anthropic.com
const CLAUDE_API_KEY = 'YOUR_API_KEY_HERE';
const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const API_URL = 'https://api.anthropic.com/v1/messages';

let chatHistory = [];
let missionContext = 'The player is in a Korean cultural RPG game.';
let missionTitle = '';

let toggleBtn, panelEl, closeBtn, messagesEl, inputEl, sendBtn;

window.chatbotSetContext = function(context, title) {
  missionContext = context;
  missionTitle = title;
  chatHistory = [];
};

function buildSystemPrompt() {
  return `You are a friendly helper inside a Korean cultural RPG game. The player is a foreigner (international student) learning how to do everyday tasks in Korea.

CURRENT MISSION: ${missionTitle}

MISSION CONTEXT:
${missionContext}

YOUR JOB:
- Help the player when they're stuck or confused
- Explain Korean culture, language, or etiquette clearly
- Keep answers SHORT (2-4 sentences usually, maximum 6 sentences)
- Be warm, encouraging, and patient
- Respond in the same language the player uses (Korean or English)
- Don't spoil the exact answer if they're in a dialog puzzle — give hints instead
- If they ask something off-topic, gently steer back to the game or Korea

FORMATTING RULES:
- Use plain text, short sentences
- Avoid markdown headers (no ###, ##)
- You may use **bold** sparingly for key terms (will be rendered nicely)
- Avoid long bullet lists (3 items max if needed)
- No emojis in every message — use them sparingly (1-2 per response max)

If they ask in English, reply in English. If they ask in Korean, reply in Korean.`;
}

// ===================================================================
// Simple markdown → HTML converter
// Handles **bold**, *italic*, `code`, and newlines
// ===================================================================
function renderMarkdown(text) {
  // Escape HTML first
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* (but not inside ** bold)
  html = html.replace(/(^|[^*])\*([^\*\n]+)\*/g, '$1<em>$2</em>');

  // Inline code: `text`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Preserve line breaks (convert to <br>)
  html = html.replace(/\n/g, '<br>');

  return html;
}

async function sendToClaud(userMessage) {
  chatHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 300,
        system: buildSystemPrompt(),
        messages: chatHistory
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;
    chatHistory.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;
  } catch (err) {
    console.error('Chatbot error:', err);
    chatHistory.pop();
    return `❌ 오류 발생 · Error: ${err.message}`;
  }
}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;

  if (type === 'bot' && !type.includes('typing')) {
    msg.innerHTML = renderMarkdown(text);
  } else {
    msg.innerText = text;
  }

  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg;
}

async function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  inputEl.value = '';
  inputEl.disabled = true;
  sendBtn.disabled = true;

  const typingMsg = addMessage('생각 중...', 'bot typing');

  const reply = await sendToClaud(text);

  typingMsg.classList.remove('typing');
  typingMsg.innerHTML = renderMarkdown(reply);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  inputEl.disabled = false;
  sendBtn.disabled = false;
  inputEl.focus();
}

window.addEventListener('load', () => {
  toggleBtn = document.getElementById('chatbot-toggle');
  panelEl = document.getElementById('chatbot-panel');
  closeBtn = document.getElementById('chatbot-close');
  messagesEl = document.getElementById('chatbot-messages');
  inputEl = document.getElementById('chatbot-input');
  sendBtn = document.getElementById('chatbot-send');

  if (!toggleBtn) return;

  toggleBtn.onclick = () => {
    panelEl.classList.toggle('open');
    if (panelEl.classList.contains('open')) {
      if (messagesEl.children.length === 0) {
        addMessage(
          '안녕하세요. 이 미션에 대해 궁금한 점이 있으면 물어보세요.\n\nHi! Ask me anything about this mission or Korean culture.',
          'bot'
        );
      }
      inputEl.focus();
    }
  };

  closeBtn.onclick = () => panelEl.classList.remove('open');
  sendBtn.onclick = handleSend;

  inputEl.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
});
