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
