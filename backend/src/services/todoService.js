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

module.exports = { listByDate, createTodo, HttpError };
