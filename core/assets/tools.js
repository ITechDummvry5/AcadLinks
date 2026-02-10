/* ===================== CONFIG ===================== */

const API_CONFIG = {
  deepseek: { name: 'DeepSeek', baseURL: 'https://api.deepseek.com/v1', endpoints: { chat: '/chat/completions', models: '/models' } },
  ollama: { name: 'Ollama Cloud', baseURL: 'https://api.x.ai/v1', endpoints: { chat: '/chat/completions', models: '/models' } },
  grok: { name: 'Grok', baseURL: 'https://api.x.ai/v1', endpoints: { chat: '/chat/completions', models: '/models' } },
  openai: { name: 'OpenAI', baseURL: 'https://api.openai.com/v1', endpoints: { chat: '/chat/completions', models: '/models' } }
};

const modelMap = {
  deepseek: 'deepseek-chat',
  ollama: 'ollama-beta',
  grok: 'grok-beta',
  openai: 'gpt-4.1-mini'
};

// 🦙 LOCAL OLLAMA (OFFLINE)
const LOCAL_OLLAMA = {
  name: 'LLaMA Local',
  baseURL: 'http://localhost:11434',
  chatEndpoint: '/api/chat',
  model: 'llama3'
};

/* ===================== STATUS UI ===================== */

function updateApiStatus(provider, status, message='') {
  const dot = document.getElementById(provider+'Status');
  const text = document.getElementById(provider+'StatusText');
  if(!dot || !text) return;

  if(status==='connected'){
    dot.className='status-dot connected';
    text.textContent='Connected ✓';
    text.style.color='#FFD700';
  } else if(status==='saved'){
    dot.className='status-dot';
    text.textContent='Configured';
    text.style.color='#ffa500';
  } else if(status==='error'){
    dot.className='status-dot';
    text.textContent=message||'Failed';
    text.style.color='#ff4444';
  } else {
    dot.className='status-dot';
    text.textContent='Not configured';
    text.style.color='#ccc';
  }
}

/* ===================== INTERNET CHECK ===================== */

function checkInternetConnection(callback) {
  if (!navigator.onLine) {
    if(callback) callback('No internet connection 🌐❌');
    return false;
  }
  return true;
}

window.addEventListener('offline', () => {
  console.log('⚠️ You are offline!');
  document.getElementById('statusText').textContent = 'No Internet Connection';
  document.getElementById('globalStatus').classList.remove('connected');
});

window.addEventListener('online', () => {
  console.log('✅ Back online!');
  document.getElementById('statusText').textContent = 'Connected';
  document.getElementById('globalStatus').classList.add('connected');
});

/* ===================== LOAD KEYS ===================== */

function loadApiKeys(){
  ['deepseek','ollama','grok','openai'].forEach(p=>{
    const key = localStorage.getItem(p+'_api_key');
    if(key){
      document.getElementById(p+'Key').value = key;
      updateApiStatus(p,'saved');
    }
  });
}

/* ===================== SAFE FETCH ===================== */

async function safeFetch(url, options){
  try{
    const res = await fetch(url, options);
    return res;
  } catch(err){
    if(err instanceof TypeError){
      throw new Error('No internet connection ⛔');
    }
    throw err;
  }
}

/* ===================== TEST CLOUD APIs ===================== */

async function testApiConnection(provider){
  const key = document.getElementById(provider+'Key').value;
  if(!key){
    updateApiStatus(provider,'error','No key');
    return false;
  }
  if(!checkInternetConnection(msg => updateApiStatus(provider,'error',msg))) return false;

  try{
    const res = await safeFetch(
      API_CONFIG[provider].baseURL + API_CONFIG[provider].endpoints.models,
      { headers:{'Authorization':`Bearer ${key}`} }
    );
    if(!res.ok) throw new Error();
    updateApiStatus(provider,'connected');
    return true;
  }catch{
    updateApiStatus(provider,'error','Invalid key or no connection');
    return false;
  }
}

/* ===================== CLOUD QUERY ===================== */

async function queryAI(provider, query, apiKey, timeout=15000){
  if(!checkInternetConnection(msg => alert(msg))) throw new Error('No internet');

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try{
    const res = await safeFetch(
      API_CONFIG[provider].baseURL + API_CONFIG[provider].endpoints.chat,
      {
        method:'POST',
        headers:{
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          model: modelMap[provider],
          messages:[{role:'user', content:query}],
          max_tokens:1000,
          temperature:0.7
        }),
        signal: controller.signal
      }
    );

    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;

  } catch(err){
    if(err.name === 'AbortError') throw new Error('Request timed out ⏱️ Try Again Later');
    throw err;
  } finally{
    clearTimeout(id);
  }
}

/* ===================== LOCAL LLaMA QUERY ===================== */

async function queryLocalLlama(query, timeout=15000){
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try{
    const res = await fetch(LOCAL_OLLAMA.baseURL + LOCAL_OLLAMA.chatEndpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model: LOCAL_OLLAMA.model,
        messages:[{role:'user', content:query}],
        stream:false
      }),
      signal: controller.signal
    });

    if(!res.ok) throw new Error('Local LLaMA not running');
    const data = await res.json();
    return data.message.content;

  } catch(err){
    if(err.name === 'AbortError') throw new Error('Request timed out ⏱️');
    throw err;
  } finally{
    clearTimeout(id);
  }
}

/* ===================== SEARCH ===================== */
async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const provider = document.getElementById('aiProvider').value;
  if (!query) return alert('Enter query');

  document.getElementById('loading').classList.add('active');
  document.getElementById('resultsSection').classList.remove('active');

  let resultsHTML = '';

  try {
    if (provider === 'llama-local') {
      // No internet needed for local LLaMA
      const text = await queryLocalLlama(query);
      resultsHTML = `
        <div class="response-card">
          <div class="provider-badge">🦙 LLaMA Local</div>
          <div class="response-content">${text}</div>
        </div>`;
    } else {
      // Only check internet for cloud APIs
      if (!checkInternetConnection(msg => alert(msg))) throw new Error('No internet for cloud APIs');

      const providers = provider === 'compare' ? ['deepseek','ollama','grok','openai'] : [provider];

      for (const p of providers) {
        const key = document.getElementById(p+'Key').value;
        if (!key) {
          resultsHTML += `<div class="error">${API_CONFIG[p].name} not configured</div>`;
          continue;
        }

        try {
          const text = await queryAI(p, query, key);
          resultsHTML += `
            <div class="response-card">
              <div class="provider-badge">${API_CONFIG[p].name}</div>
              <div class="response-content">${text}</div>
            </div>`;
        } catch (err) {
          resultsHTML += `<div class="error">${API_CONFIG[p].name}: ${err.message}</div>`;
        }
      }
    }
  } catch (err) {
    resultsHTML = `<div class="error">🦙 ${err.message}</div>`;
  }

  document.getElementById('resultsArea').innerHTML = resultsHTML;
  document.getElementById('loading').classList.remove('active');
  document.getElementById('resultsSection').classList.add('active');
}


/* ===================== BUTTONS ===================== */

document.getElementById('testApisBtn').onclick = async () => {
  const results = await Promise.all(
    ['deepseek','ollama','grok','openai'].map(testApiConnection)
  );
  const ok = results.filter(Boolean).length;
  if(ok > 0){
    document.getElementById('searchSection').classList.add('active');
    document.getElementById('globalStatus').classList.add('connected');
    document.getElementById('statusText').textContent = `APP: ${ok}/4 APIs connected`;
  }
};

document.getElementById('saveConfigBtn').onclick = () => {
  ['deepseek','ollama','grok','openai'].forEach(p=>{
    const key = document.getElementById(p+'Key').value;
    if(key) localStorage.setItem(p+'_api_key', key);
  });
  alert('Keys saved');
};

document.getElementById('llamaLocalBtn').onclick = () => {
  document.getElementById('searchSection').classList.add('active');
  document.getElementById('aiProvider').value = 'llama-local';
  document.getElementById('globalStatus').classList.add('connected');
  document.getElementById('statusText').textContent = 'APP: Using LLaMA Local (Offline)';
};

document.getElementById('searchBtn').onclick = performSearch;

/* ===================== INIT ===================== */

loadApiKeys();
