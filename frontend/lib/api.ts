const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// API Error with status code
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

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
