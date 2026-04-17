import { monthGrid, monthLabel, addMonths, toISO, todayISO } from '../utils/date.js';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({
  year,
  month,
  selectedDate,
  markedDates = [],
  onSelectDate,
  onChangeMonth,
}) {
  const cells = monthGrid(year, month);
  const today = todayISO();
  const markedSet = new Set(markedDates);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          aria-label="이전 달"
          className="px-3 py-1 rounded hover:bg-gray-100"
          onClick={() => onChangeMonth(addMonths(year, month, -1))}
        >
          ◀
        </button>
        <h2 className="text-lg font-semibold">{monthLabel(year, month)}</h2>
        <button
          type="button"
          aria-label="다음 달"
          className="px-3 py-1 rounded hover:bg-gray-100"
          onClick={() => onChangeMonth(addMonths(year, month, 1))}
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-1">
        {WEEK_DAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const iso = toISO(d);
          const inMonth = d.getMonth() === month;
          const isToday = iso === today;
          const isSelected = iso === selectedDate;
          const isMarked = markedSet.has(iso);
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              aria-label={iso}
              aria-pressed={isSelected}
              className={[
                'aspect-square flex flex-col items-center justify-center rounded-md text-sm relative',
                inMonth ? 'text-gray-900' : 'text-gray-300',
                isSelected
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'hover:bg-gray-100',
                isToday && !isSelected ? 'ring-2 ring-blue-500' : '',
              ].join(' ')}
            >
              <span>{d.getDate()}</span>
              {isMarked && (
                <span
                  data-testid="date-marker"
                  aria-hidden="true"
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-blue-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
