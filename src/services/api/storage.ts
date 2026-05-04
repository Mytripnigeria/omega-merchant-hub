import { apiRequest, tokenStorage } from '@/lib/api-client';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface StoredFile {
  id: string;
  key: string;
  url: string;
  originalName: string;
  mimetype: string;
  size: number;
  folder: string | null;
  uploadedById: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFiles {
  data: StoredFile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function unwrap<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return json.data as T;
}

export const storageApi = {
  async upload(file: File, folder?: string): Promise<StoredFile> {
    const token = tokenStorage.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    const res = await fetch(`${API_URL}/files${qs}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    return unwrap<StoredFile>(res);
  },

  get(id: string) {
    return apiRequest<StoredFile>(`/files/${id}`);
  },

  list(params?: { folder?: string; page?: number; limit?: number }) {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    return apiRequest<PaginatedFiles>(`/files${qs}`);
  },

  remove(id: string) {
    return apiRequest<void>(`/files/${id}`, { method: 'DELETE' });
  },
};
