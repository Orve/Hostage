import { createClient } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// API Error with status code
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

// Types
export type Pet = {
  id: string;
  user_id: string;
  name: string;
  hp: number;
  max_hp: number;
  status: 'ALIVE' | 'DEAD' | 'CRITICAL';
  infection_level: number;
  born_at: string;
  last_checked_at: string;
  character_type?: string;
};

export type CreatePetRequest = {
  user_id: string;
  name: string;
  character_type: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: 'notion' | 'native';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type CreateTaskRequest = {
  user_id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
};

export type TaskListResponse = {
  tasks: Task[];
  total: number;
};

export type TaskCompleteResponse = {
  status: string;
  task: Task;
  pet: Pet;
  healed: number;
  message: string;
};

export type DailyHabit = {
  id: string;
  user_id: string;
  title: string;
  streak: number;
  last_completed_at: string | null;
  created_at: string;
};

export type CreateDailyHabitRequest = {
  user_id: string;
  title: string;
};

export type DailyHabitListResponse = {
  habits: DailyHabit[];
  total: number;
};

export type DailyHabitCheckResponse = {
  habit: DailyHabit;
  action: string;
  new_streak: number;
  message: string;
  healed: number;
};

// Supabase セッションから Bearer トークン付き headers を取得する
async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new APIError(401, "Not authenticated");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function createPet(petData: CreatePetRequest): Promise<Pet> {
  const url = `${API_BASE}/pets/`;
  console.log('[API] Creating pet:', { url });

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: petData.name,
        character_type: petData.character_type,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('[API] Create pet error:', { status: res.status, errorData });
      throw new APIError(res.status, errorData.detail || `Failed to create pet (${res.status})`);
    }

    const data = await res.json();
    console.log('[API] Pet created successfully:', data);
    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('[API] Network or parsing error during pet creation:', error);
    throw new APIError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchPetStatus(_userId: string): Promise<Pet | null> {
  const url = `${API_BASE}/pets/me`;
  console.log('[API] Fetching pet status:', { url, API_BASE });

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(url, {
      headers,
      cache: "no-store",
    });
    console.log('[API] Response status:', res.status);

    if (res.status === 404) {
      console.log('[API] Pet not found (404) - returning null');
      return null;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.detail || `Failed to fetch pet status (${res.status})`;
      console.error('[API] Error response:', errorData);
      throw new APIError(res.status, errorMessage);
    }
    const data = await res.json();
    console.log('[API] Pet data received:', data);
    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    console.error('[API] Network or parsing error:', error);
    throw new APIError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function completeHabit(habitId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/habits/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify({ habit_id: habitId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to complete habit");
  }
  return res.json();
}

export async function syncNotion(_userId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/cron/sync`, {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to sync");
  }
  return res.json();
}

export async function revivePet(petId: string): Promise<Pet> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/pets/${petId}/revive`, {
    method: "POST",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to revive pet");
  }
  return res.json();
}

export async function deletePet(_userId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/pets/me`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    throw new APIError(res.status, "Failed to purge pet data");
  }
}

export async function createTask(taskData: CreateTaskRequest): Promise<Task> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      due_date: taskData.due_date,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to create task");
  }
  return res.json();
}

export async function fetchTasks(
  _userId: string,
  completed?: boolean
): Promise<TaskListResponse> {
  const headers = await getAuthHeaders();
  let url = `${API_BASE}/tasks/`;
  if (completed !== undefined) {
    url += `?completed=${completed}`;
  }
  const res = await fetch(url, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to fetch tasks");
  }
  return res.json();
}

export async function completeTask(taskId: string): Promise<TaskCompleteResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/tasks/complete`, {
    method: "POST",
    headers,
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to complete task");
  }
  return res.json();
}

export async function deleteTask(taskId: string): Promise<{ status: string; task_id: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to delete task");
  }
  return res.json();
}

export async function fetchDailyHabits(_userId: string): Promise<DailyHabitListResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/daily-habits/`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to fetch daily habits");
  }
  return res.json();
}

export async function createDailyHabit(habitData: CreateDailyHabitRequest): Promise<DailyHabit> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/daily-habits/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title: habitData.title }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to create daily habit");
  }
  return res.json();
}

export async function toggleDailyHabitCheck(habitId: string): Promise<DailyHabitCheckResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/daily-habits/${habitId}/check`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to toggle daily habit");
  }
  return res.json();
}

export async function deleteDailyHabit(habitId: string): Promise<{ status: string; habit_id: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/daily-habits/${habitId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to delete daily habit");
  }
  return res.json();
}
