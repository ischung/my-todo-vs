#!/usr/bin/env bash
# smoke-local.sh — 로컬 Docker 이미지를 띄워 Playwright smoke test를 실행
#
# 우선순위:
#   1) 환경변수 IMAGE 로 지정된 이미지
#   2) ghcr.io/ischung/my-todo-vs:latest (pull 시도)
#   3) my-todo-vs:dev (로컬 docker-compose 빌드 결과물, fallback)
#
# Usage:
#   bash scripts/smoke-local.sh               # 기본 흐름
#   IMAGE=my-todo-vs:test bash scripts/smoke-local.sh

set -euo pipefail

IMAGE="${IMAGE:-}"
CID=""

cleanup() {
  if [ -n "$CID" ]; then
    echo "▶ cleanup: stop+rm container"
    docker stop "$CID" >/dev/null 2>&1 || true
    docker rm "$CID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [ -z "$IMAGE" ]; then
  REMOTE="ghcr.io/ischung/my-todo-vs:latest"
  LOCAL="my-todo-vs:dev"
  if docker pull "$REMOTE" >/dev/null 2>&1; then
    IMAGE="$REMOTE"
  elif docker image inspect "$LOCAL" >/dev/null 2>&1; then
    IMAGE="$LOCAL"
  else
    echo "▶ building local fallback image: $LOCAL"
    docker build -t "$LOCAL" .
    IMAGE="$LOCAL"
  fi
fi

echo "▶ using image: $IMAGE"

CID=$(docker run -d -p 8080:8080 "$IMAGE")
echo "▶ started container: $CID"

echo "▶ waiting for /api/health ..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8080/api/health >/dev/null 2>&1; then
    echo "▶ health ok (${i}s)"
    break
  fi
  sleep 1
  if [ "$i" = "30" ]; then
    echo "❌ health check timeout"
    docker logs "$CID" | tail -30 || true
    exit 1
  fi
done

echo "▶ running Playwright smoke tests"
cd e2e
if [ ! -d node_modules ]; then
  npm install --silent
fi
if [ ! -d "$HOME/Library/Caches/ms-playwright" ] && [ ! -d "$HOME/.cache/ms-playwright" ]; then
  npx playwright install chromium
fi

E2E_BASE_URL=http://localhost:8080 npm run smoke --workspace=e2e
