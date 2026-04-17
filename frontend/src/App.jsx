import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState({ state: 'loading' });

  useEffect(() => {
    fetch('/api/health')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((body) =>
        setHealth({ state: 'ok', timestamp: body.timestamp, version: body.version })
      )
      .catch((err) => setHealth({ state: 'error', message: err.message }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          날짜별 할일 관리
        </h1>

        {health.state === 'loading' && (
          <p className="text-gray-500">서버 확인 중…</p>
        )}

        {health.state === 'ok' && (
          <p className="text-green-600">
            ✅ 서버 연결 OK ({health.timestamp})
          </p>
        )}

        {health.state === 'error' && (
          <p className="text-red-500">
            ❌ 서버에 연결할 수 없어요 ({health.message})
          </p>
        )}

        <p className="text-gray-500 text-sm mt-4">
          실제 기능 UI는 issue #14부터 구현됩니다.
        </p>
      </div>
    </div>
  );
}
