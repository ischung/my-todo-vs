const repo = require('../repositories/todoRepository');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function assertDate(date) {
  if (!date || !DATE_RE.test(date)) {
    throw new HttpError(400, '날짜 형식이 잘못되었습니다. YYYY-MM-DD 형식이어야 합니다.');
  }
}

function assertTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new HttpError(400, '제목을 입력해주세요.');
  }
  if (title.length > 100) {
    throw new HttpError(400, '제목은 100자 이하여야 합니다.');
  }
}

function listByDate(date) {
  assertDate(date);
  return repo.findByDate(date);
}

function createTodo({ title, date }) {
  assertTitle(title);
  assertDate(date);
  return repo.create({ title: title.trim(), date });
}

function updateTodo(id, patch) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(400, '잘못된 ID입니다.');
  }
  const clean = {};
  if (typeof patch.title !== 'undefined') {
    assertTitle(patch.title);
    clean.title = patch.title.trim();
  }
  if (typeof patch.completed !== 'undefined') {
    if (typeof patch.completed !== 'boolean') {
      throw new HttpError(400, 'completed 는 boolean이어야 합니다.');
    }
    clean.completed = patch.completed;
  }
  const updated = repo.update(parsedId, clean);
  if (!updated) {
    throw new HttpError(404, '해당 할일을 찾을 수 없습니다.');
  }
  return updated;
}

function deleteTodo(id) {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError(400, '잘못된 ID입니다.');
  }
  const removed = repo.remove(parsedId);
  if (!removed) {
    throw new HttpError(404, '해당 할일을 찾을 수 없습니다.');
  }
}

function listDatesInMonth(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!Number.isInteger(y) || y < 1900 || y > 3000) {
    throw new HttpError(400, 'year 값이 잘못되었습니다.');
  }
  if (!Number.isInteger(m) || m < 1 || m > 12) {
    throw new HttpError(400, 'month 값은 1~12 사이여야 합니다.');
  }
  return repo.findDatesInMonth(y, m);
}

module.exports = {
  listByDate,
  createTodo,
  updateTodo,
  deleteTodo,
  listDatesInMonth,
  HttpError,
};
