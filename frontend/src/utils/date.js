export function todayISO() {
  return toISO(new Date());
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function firstOfMonth(year, month0Indexed) {
  return new Date(year, month0Indexed, 1);
}

/**
 * Returns a 6×7 grid of Date objects for the given year/month,
 * starting from the Sunday on/before the 1st.
 */
export function monthGrid(year, month0Indexed) {
  const first = firstOfMonth(year, month0Indexed);
  const start = new Date(first);
  start.setDate(1 - first.getDay()); // back up to Sunday
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export function monthLabel(year, month0Indexed) {
  return `${year}년 ${month0Indexed + 1}월`;
}

export function addMonths(year, month0Indexed, delta) {
  const d = new Date(year, month0Indexed + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}
