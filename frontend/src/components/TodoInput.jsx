import { useState } from 'react';

export default function TodoInput({ onAdd, disabled }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSave = title.trim().length > 0 && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 text-sm"
      >
        + 할일 추가
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할일 제목"
        maxLength={100}
        aria-label="새 할일 제목"
        className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <button
        type="submit"
        disabled={!canSave}
        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 text-sm"
      >
        저장
      </button>
      <button
        type="button"
        onClick={() => {
          setTitle('');
          setOpen(false);
        }}
        className="px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 text-sm"
      >
        취소
      </button>
    </form>
  );
}
