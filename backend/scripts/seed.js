// Dev-only seed: inserts a few todos for yesterday/today/tomorrow.
const { getDb, closeDb } = require('../src/db');

function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function seed() {
  const db = getDb();

  const existing = db.prepare('SELECT COUNT(*) as c FROM todos').get();
  if (existing.c > 0) {
    console.log(`[seed] skipped — ${existing.c} rows already exist`);
    return;
  }

  const insert = db.prepare('INSERT INTO todos (title, date) VALUES (?, ?)');
  const today = isoDate(0);
  const yest = isoDate(-1);
  const tom = isoDate(1);

  insert.run('어제 마무리 못한 보고서', yest);
  insert.run('팀 스탠드업 참석', today);
  insert.run('회의 준비 (오늘 14:00)', today);
  insert.run('내일 강의 슬라이드 점검', tom);

  console.log(`[seed] inserted 4 todos across ${yest}, ${today}, ${tom}`);
}

try {
  seed();
} finally {
  closeDb();
}
