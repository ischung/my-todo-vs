export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          날짜별 할일 관리
        </h1>
        <p className="text-gray-500">
          Vite + React + Tailwind 스캐폴드 완료. 실제 UI는{' '}
          <a
            href="https://github.com/ischung/my-todo-vs/issues/14"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            issue #14
          </a>
          부터 구현됩니다.
        </p>
      </div>
    </div>
  );
}
