import TodoInput from './TodoInput.jsx';
import TodoItem from './TodoItem.jsx';

export default function TodoPanel({
  selectedDate,
  todos,
  loading,
  error,
  onAdd,
  onToggle,
  onEdit,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{selectedDate}</h2>
        <TodoInput onAdd={onAdd} disabled={loading} />
      </div>

      {loading && <p className="text-gray-500 text-sm">불러오는 중…</p>}

      {error && (
        <p className="text-red-500 text-sm">
          앗, 문제가 생겼어요. 다시 시도해주세요. ({error})
        </p>
      )}

      {!loading && !error && todos.length === 0 && (
        <p className="text-gray-500">
          이 날짜에는 아직 할일이 없어요. 첫 번째 할일을 추가해보세요!
        </p>
      )}

      {!loading && !error && todos.length > 0 && (
        <ul className="space-y-2">
          {todos.map((t) => (
            <TodoItem key={t.id} todo={t} onToggle={onToggle} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </div>
  );
}
