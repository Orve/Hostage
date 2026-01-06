const API_BASE = "http://localhost:8000";

export async function fetchPetStatus(userId: string) {
  const res = await fetch(`${API_BASE}/pets/${userId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch pet status");
  return res.json();
}

export async function completeHabit(habitId: string) {
  const res = await fetch(`${API_BASE}/habits/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit_id: habitId }),
  });
  if (!res.ok) throw new Error("Failed to complete habit");
  return res.json();
}

export async function syncNotion(userId: string) {
  const res = await fetch(`${API_BASE}/cron/sync?user_id=${userId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to sync notion");
  return res.json();
}
