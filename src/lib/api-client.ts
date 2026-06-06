const API_URL = import.meta.env.VITE_API_URL as string;

const TOKEN_KEY = 'omega_admin_token';
const REFRESH_TOKEN_KEY = 'omega_admin_refresh_token';

// Event names dispatched on window when the admin session changes. Long-lived
// contexts (StoreContext, AuthContext) listen for these to re-fetch or reset
// without having to be wired into the login/logout call sites.
export const AUTH_CHANGED_EVENT = 'omega:auth-changed';
export const AUTH_CLEARED_EVENT = 'omega:auth-cleared';

function dispatchAuthEvent(name: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(name));
  }
}

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Fire a notification so contexts mounted before login (e.g. StoreContext
    // at the root of the app tree) know to re-fetch with the new token.
    dispatchAuthEvent(AUTH_CHANGED_EVENT);
  },
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    dispatchAuthEvent(AUTH_CLEARED_EVENT);
  },
};

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${API_URL}/auth/admin/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    tokenStorage.clear();
    window.location.href = '/auth/login';
    throw new Error('Session expired');
  }

  const json = await res.json();
  const newToken = json.data.accessToken as string;
  tokenStorage.setToken(newToken);
  return newToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.getToken();

  const makeRequest = async (accessToken: string | null) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  let response = await makeRequest(token);

  if (response.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        isRefreshing = false;
        response = await makeRequest(newToken);
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        throw err;
      }
    } else {
      await new Promise<void>((resolve) => {
        refreshQueue.push((newToken) => {
          makeRequest(newToken).then((r) => {
            response = r;
            resolve();
          });
        });
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorBody.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const json = await response.json();
  return json.data as T;
}

/**
 * Downloads a binary response (e.g. an .xlsx export) and triggers a browser
 * save dialog. Honors the same auth header + 401-refresh handling as
 * `apiRequest`, but skips JSON parsing.
 */
export async function apiDownload(path: string): Promise<void> {
  const token = tokenStorage.getToken();

  const makeRequest = async (accessToken: string | null) => {
    const headers: Record<string, string> = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    return fetch(`${API_URL}${path}`, { method: 'GET', headers });
  };

  let response = await makeRequest(token);
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    response = await makeRequest(newToken);
  }
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {
      // not JSON — keep the status-based message
    }
    throw new Error(message);
  }

  // Pull filename out of Content-Disposition when present, fall back to the
  // last path segment otherwise.
  const dispositionFilename = (() => {
    const cd = response.headers.get('Content-Disposition') ?? '';
    const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd);
    return m ? decodeURIComponent(m[1]) : null;
  })();

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = dispositionFilename ?? path.split('/').pop() ?? 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
