import { apiRequest } from '@/lib/api-client';

export type PrinterType = 'kitchen' | 'receipt' | 'bar' | 'label';
export type PrinterConnection = 'network' | 'usb' | 'bluetooth' | 'cloud';

export interface Printer {
  id: string;
  storeId: string;
  name: string;
  type: PrinterType;
  connection: PrinterConnection;
  address?: string;
  config: Record<string, unknown> | null;
  isActive: boolean;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrinterPayload {
  storeId: string;
  name: string;
  type: PrinterType;
  connection: PrinterConnection;
  address?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
}

export const printersApi = {
  list(storeId?: string) {
    const qs = storeId ? `?storeId=${storeId}` : '';
    return apiRequest<Printer[]>(`/printers${qs}`);
  },
  create(data: CreatePrinterPayload) {
    return apiRequest<Printer>('/printers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Omit<CreatePrinterPayload, 'storeId'>>) {
    return apiRequest<Printer>(`/printers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/printers/${id}`, { method: 'DELETE' });
  },
};
