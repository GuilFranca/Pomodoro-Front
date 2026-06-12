const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

function getToken(): string | null {
  return localStorage.getItem('chronos-token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> ?? {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Erro ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  me: () => request<AuthUser>('/auth/me'),
};

// ─── Settings ────────────────────────────────────────────────────────────────

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

// ─── Tasks ───────────────────────────────────────────────────────────────────

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
