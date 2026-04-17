import { useCallback, useEffect, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import TodoPanel from './components/TodoPanel.jsx';
import Toast from './components/Toast.jsx';
import {
  fetchTodosByDate,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos.js';
import { todayISO } from './utils/date.js';

function initialMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [{ year, month }, setCurrentMonth] = useState(initialMonth);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const handleAdd = useCallback(
    async (title) => {
      try {
        const todo = await createTodo({ title, date: selectedDate });
        setTodos((prev) => [...prev, todo]);
      } catch (err) {
        setToast(err.message || '저장하지 못했어요. 다시 시도해주세요.');
      }
    },
    [selectedDate]
  );

  const handleToggle = useCallback(async (id, completed) => {
    try {
      const updated = await updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setToast(err.message || '수정하지 못했어요. 다시 시도해주세요.');
    }
  }, []);

  const handleEdit = useCallback(async (id, patch) => {
    const updated = await updateTodo(id, patch);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setToast(err.message || '삭제하지 못했어요. 다시 시도해주세요.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTodosByDate(selectedDate)
      .then((list) => {
        if (!cancelled) setTodos(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-5xl mx-auto mb-4">
        <h1 className="text-2xl font-bold text-gray-900">날짜별 할일 관리</h1>
        <p className="text-sm text-gray-500">
          서버 연결 OK — 캘린더에서 날짜를 선택하세요
        </p>
      </header>

      <main className="max-w-5xl mx-auto grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Calendar
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onChangeMonth={setCurrentMonth}
          />
        </div>
        <div className="md:col-span-3">
          <TodoPanel
            selectedDate={selectedDate}
            todos={todos}
            loading={loading}
            error={error}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
