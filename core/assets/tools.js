/* ===================== CONFIG ===================== */

const API_CONFIG = {
  deepseek: { name: 'DeepSeek', baseURL: 'https://api.deepseek.com/v1', chat: '/chat/completions', models: '/models' },
  ollama:  { name: 'Ollama Cloud', baseURL: 'https://api.x.ai/v1', chat: '/chat/completions', models: '/models' },
  grok:    { name: 'Grok', baseURL: 'https://api.x.ai/v1', chat: '/chat/completions', models: '/models' },
  openai:  { name: 'OpenAI', baseURL: 'https://api.openai.com/v1', chat: '/chat/completions', models: '/models' }
};

const PROVIDERS = Object.keys(API_CONFIG);

const MODEL_MAP = {
  deepseek: 'deepseek-chat',
  ollama: 'ollama-beta',
  grok: 'grok-beta',
  openai: 'gpt-4.1-mini'
};

const LOCAL_OLLAMA = {
  baseURL: 'http://localhost:11434/api/chat',
  model: 'llama3'
};

/* ===================== DOM CACHE ===================== */

const DOM = {
  globalStatus: document.getElementById('globalStatus'),
  statusText: document.getElementById('statusText'),
  searchInput: document.getElementById('searchInput'),
  aiProvider: document.getElementById('aiProvider'),
  resultsArea: document.getElementById('resultsArea'),
  loading: document.getElementById('loading'),
  resultsSection: document.getElementById('resultsSection'),
  searchSection: document.getElementById('searchSection')
};

/* ===================== HELPERS ===================== */

const hasInternet = () => navigator.onLine;

const escapeHTML = str =>
  str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));

async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(id);
  }
}

/* ===================== STATUS UI ===================== */

function updateApiStatus(provider, status, message = '') {
  const dot = document.getElementById(provider + 'Status');
  const text = document.getElementById(provider + 'StatusText');
  if (!dot || !text) return;

  const map = {
    connected: ['status-dot connected', 'Connected ✓', '#FFD700'],
    saved: ['status-dot', 'Configured', '#ffa500'],
    error: ['status-dot', message || 'Failed', '#ff4444'],
    default: ['status-dot', 'Not configured', '#ccc']
  };

  const [cls, label, color] = map[status] || map.default;
  dot.className = cls;
  text.textContent = label;
  text.style.color = color;
}

/* ===================== API CHECK ===================== */

async function testApiConnection(provider) {
  const key = document.getElementById(provider + 'Key').value.trim();

  if (!key) {
    updateApiStatus(provider, 'error', 'No key');
    return false;
  }

  if (!hasInternet()) {
    updateApiStatus(provider, 'error', 'Offline');
    return false;
  }

  try {
    await fetchWithTimeout(
      API_CONFIG[provider].baseURL + API_CONFIG[provider].models,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    updateApiStatus(provider, 'connected');
    return true;
  } catch {
    updateApiStatus(provider, 'error', 'Invalid key');
    return false;
  }
}

/* ===================== QUERY ===================== */

async function queryCloud(provider, query, key) {
  const data = await fetchWithTimeout(
    API_CONFIG[provider].baseURL + API_CONFIG[provider].chat,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_MAP[provider],
        messages: [{ role: 'user', content: query }],
        max_tokens: 1000,
        temperature: 0.7
      })
    }
  );
  return data.choices[0].message.content;
}

async function queryLocal(query) {
  const data = await fetchWithTimeout(LOCAL_OLLAMA.baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LOCAL_OLLAMA.model,
      messages: [{ role: 'user', content: query }],
      stream: false
    })
  });
  return data.message.content;
}

/* ===================== SEARCH ===================== */

async function performSearch() {
  const query = DOM.searchInput.value.trim();
  if (!query) return alert('Enter search query');

  DOM.loading.classList.add('active');
  DOM.resultsSection.classList.remove('active');
  DOM.resultsArea.innerHTML = '';

  try {
    const provider = DOM.aiProvider.value;

    if (provider === 'llama-local') {
      const text = await queryLocal(query);
      DOM.resultsArea.innerHTML = `
        <div class="response-card">
          <div class="provider-badge">🦙 LLaMA Local</div>
          <div class="response-content">${escapeHTML(text)}</div>
        </div>`;
    } else {
      if (!hasInternet()) throw new Error('No internet connection');

      const providers = provider === 'compare' ? PROVIDERS : [provider];

      const tasks = providers.map(p => {
        const key = document.getElementById(p + 'Key').value.trim();
        if (!key) return Promise.reject(`${API_CONFIG[p].name} not configured`);
        return queryCloud(p, query, key).then(text => ({ p, text }));
      });

      const results = await Promise.allSettled(tasks);

      DOM.resultsArea.innerHTML = results.map(r =>
        r.status === 'fulfilled'
          ? `<div class="response-card">
               <div class="provider-badge">${API_CONFIG[r.value.p].name}</div>
               <div class="response-content">${escapeHTML(r.value.text)}</div>
             </div>`
          : `<div class="error">${r.reason}</div>`
      ).join('');
    }
  } catch (err) {
    DOM.resultsArea.innerHTML = `<div class="error">${err.message}</div>`;
  }

  DOM.loading.classList.remove('active');
  DOM.resultsSection.classList.add('active');
}

/* ===================== STORAGE ===================== */

function loadApiKeys() {
  PROVIDERS.forEach(p => {
    const key = localStorage.getItem(p + '_api_key');
    if (key) {
      document.getElementById(p + 'Key').value = key;
      updateApiStatus(p, 'saved');
    }
  });
}

document.getElementById('saveConfigBtn').onclick = () => {
  PROVIDERS.forEach(p => {
    const key = document.getElementById(p + 'Key').value.trim();
    if (key) {
      localStorage.setItem(p + '_api_key', key);
      updateApiStatus(p, 'saved');
    }
  });
  alert('API keys saved');
};

/* ===================== BUTTONS ===================== */

document.getElementById('testApisBtn').onclick = async () => {
  const results = await Promise.all(PROVIDERS.map(testApiConnection));
  const ok = results.filter(Boolean).length;

  if (ok > 0) {
    DOM.searchSection.classList.add('active');
    DOM.globalStatus.classList.add('connected');
    DOM.statusText.textContent = `APP: ${ok}/${PROVIDERS.length} APIs connected`;
  } else {
    DOM.statusText.textContent = 'APP: No APIs connected';
  }
};

document.getElementById('llamaLocalBtn').onclick = () => {
  DOM.searchSection.classList.add('active');
  DOM.aiProvider.value = 'llama-local';
  DOM.globalStatus.classList.add('connected');
  DOM.statusText.textContent = 'APP: Using LLaMA Local (Offline)';
};

document.getElementById('searchBtn').onclick = performSearch;

/* ===================== ONLINE / OFFLINE ===================== */

window.addEventListener('online', () => {
  DOM.statusText.textContent = 'Connected';
  DOM.globalStatus.classList.add('connected');
});

window.addEventListener('offline', () => {
  DOM.statusText.textContent = 'No Internet';
  DOM.globalStatus.classList.remove('connected');
});

/* ===================== INIT ===================== */

loadApiKeys();
