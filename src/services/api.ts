const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Erro ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export type SettingsPayload = {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
};

export type SettingsResponse = SettingsPayload & {
  id: number;
  updatedAt: string;
};

export const settingsApi = {
  get: () => request<SettingsResponse>('/settings'),
  update: (payload: SettingsPayload) =>
    request<SettingsResponse>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export type TaskApiPayload = {
  id: string;
  name: string;
  duration: number;
  type: string;
  startDate: number;
};

export type TaskApiResponse = TaskApiPayload & {
  completeDate: string | null;
  interruptDate: string | null;
  createdAt: string;
};

export const tasksApi = {
  list: () => request<TaskApiResponse[]>('/tasks'),
  create: (payload: TaskApiPayload) =>
    request<TaskApiResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  complete: (id: string, completeDate: number) =>
    request<TaskApiResponse>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completeDate }),
    }),
  interrupt: (id: string, interruptDate: number) =>
    request<TaskApiResponse>(`/tasks/${id}/interrupt`, {
      method: 'PATCH',
      body: JSON.stringify({ interruptDate }),
    }),
  deleteAll: () => request<void>('/tasks', { method: 'DELETE' }),
};
