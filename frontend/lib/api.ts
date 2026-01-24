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
  infection_level: number; // 復活
  born_at: string;
  last_checked_at: string;
  character_type?: string; // Optional for backward compatibility, but backend sets default
};

export type CreatePetRequest = {
  user_id: string;
  name: string;
  character_type: string;
};

// ... (Skip unrelated types)

export async function createPet(petData: CreatePetRequest): Promise<Pet> {
  const res = await fetch(`${API_BASE}/pets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: petData.user_id,
      name: petData.name,
      character_type: petData.character_type,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to create pet");
  }
  return res.json();
}
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

export async function fetchPetStatus(userId: string) {
  const res = await fetch(`${API_BASE}/pets/${userId}`, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to fetch pet status");
  }
  return res.json();
}

export async function completeHabit(habitId: string) {
  const res = await fetch(`${API_BASE}/habits/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit_id: habitId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to complete habit");
  }
  return res.json();
}

export async function syncNotion(userId: string) {
  const res = await fetch(`${API_BASE}/cron/sync?user_id=${userId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to sync notion");
  }
  return res.json();
}



export async function revivePet(petId: string): Promise<Pet> {
  const res = await fetch(`${API_BASE}/pets/${petId}/revive`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to revive pet");
  }
  return res.json();
}


// ========== タスク管理API ==========

/**
 * タスクを作成する
 */
export async function createTask(taskData: CreateTaskRequest): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to create task");
  }
  return res.json();
}

/**
 * ユーザーのタスク一覧を取得する
 */
export async function fetchTasks(
  userId: string,
  completed?: boolean
): Promise<TaskListResponse> {
  let url = `${API_BASE}/tasks/${userId}`;
  if (completed !== undefined) {
    url += `?completed=${completed}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to fetch tasks");
  }
  return res.json();
}

/**
 * タスクを完了する（ペットのHPも回復）
 */
export async function completeTask(taskId: string): Promise<TaskCompleteResponse> {
  const res = await fetch(`${API_BASE}/tasks/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_id: taskId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to complete task");
  }
  return res.json();
}

/**
 * タスクを削除する
 */
export async function deleteTask(taskId: string): Promise<{ status: string; task_id: string }> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to delete task");
  }
  return res.json();
}

// ========== 日次習慣管理API ==========

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
};

/**
 * ユーザーの日次習慣一覧を取得する
 */
export async function fetchDailyHabits(userId: string): Promise<DailyHabitListResponse> {
  const res = await fetch(`${API_BASE}/daily-habits/${userId}`, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to fetch daily habits");
  }
  return res.json();
}

/**
 * 日次習慣を作成する
 */
export async function createDailyHabit(habitData: CreateDailyHabitRequest): Promise<DailyHabit> {
  const res = await fetch(`${API_BASE}/daily-habits/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habitData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to create daily habit");
  }
  return res.json();
}

/**
 * 日次習慣の完了/未完了をトグルする
 */
export async function toggleDailyHabitCheck(habitId: string): Promise<DailyHabitCheckResponse> {
  const res = await fetch(`${API_BASE}/daily-habits/${habitId}/check`, {
    method: "PUT",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to toggle daily habit");
  }
  return res.json();
}

/**
 * 日次習慣を削除する
 */
export async function deleteDailyHabit(habitId: string): Promise<{ status: string; habit_id: string }> {
  const res = await fetch(`${API_BASE}/daily-habits/${habitId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new APIError(res.status, errorData.detail || "Failed to delete daily habit");
  }
  return res.json();
}

