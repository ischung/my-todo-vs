import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [error, setError] = useState(null);

  async function commit() {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      setError('제목을 입력해주세요');
      return;
    }
    if (trimmed === todo.title) {
      setEditing(false);
      return;
    }
    try {
      await onEdit(todo.id, { title: trimmed });
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function cancel() {
    setDraft(todo.title);
    setEditing(false);
    setError(null);
  }

  return (
    <li className="flex items-center gap-2 p-2 rounded border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
        aria-label={`${todo.title} 완료 여부`}
        className="h-4 w-4 cursor-pointer"
      />
      {editing ? (
        <div className="flex-1 flex flex-col gap-1">
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancel();
            }}
            maxLength={100}
            aria-label="할일 제목 편집"
            className="px-2 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`flex-1 text-left cursor-pointer ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
          aria-label={`${todo.title} 수정`}
        >
          {todo.title}
        </button>
      )}
    </li>
  );
}
