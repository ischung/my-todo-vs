export default function TodoPanel({ selectedDate, todos, loading, error }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">{selectedDate}</h2>

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
            <li
              key={t.id}
              className="flex items-center gap-2 p-2 rounded border border-gray-200"
            >
              <input
                type="checkbox"
                checked={t.completed}
                disabled
                aria-label={`${t.title} 완료 여부`}
                className="h-4 w-4"
              />
              <span
                className={t.completed ? 'line-through text-gray-400' : 'text-gray-900'}
              >
                {t.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
