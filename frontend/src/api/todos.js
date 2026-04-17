async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function fetchTodosByDate(date) {
  return fetch(`/api/todos?date=${encodeURIComponent(date)}`).then(handle);
}

export function fetchMarkedDates(year, month) {
  return fetch(`/api/todos/dates?year=${year}&month=${month}`).then(handle);
}

export function createTodo({ title, date }) {
  return fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date }),
  }).then(handle);
}

export function updateTodo(id, patch) {
  return fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }).then(handle);
}

export function deleteTodo(id) {
  return fetch(`/api/todos/${id}`, { method: 'DELETE' }).then(handle);
}
