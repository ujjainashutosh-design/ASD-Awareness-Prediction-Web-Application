// Use relative paths so Vite's proxy forwards them to the Express server.
// Vite proxy: /api  →  http://localhost:3001
// This avoids any CORS issues since requests come from the same origin.
const API = '/api';

function headers(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req(method, path, body, token) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: headers(token),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error('Cannot connect to server. Is the API running on port 3001?');
  }

  // Check content-type before parsing — HTML means a proxy/404 error
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server error (${res.status}): API server may not be running. Start it with: cd server && node index.js`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  register:   (body)        => req('POST', '/auth/register', body),
  login:      (body)        => req('POST', '/auth/login', body),
  me:         (token)       => req('GET',  '/auth/me', null, token),
  predict:    (body, token) => req('POST', '/predict', body, token),
  getResults: (token)       => req('GET',  '/results', null, token),
  getResult:  (id, token)   => req('GET',  `/results/${id}`, null, token),
};
