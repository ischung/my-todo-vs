#!/usr/bin/env bash
# publish-ghcr.sh — 이미지 1개를 ghcr.io로 수동 push하는 헬퍼
# Usage:
#   KANBAN_TOKEN=<your_pat_with_write:packages> \
#   bash scripts/publish-ghcr.sh [version]
# 기본 버전: v0.0.1

set -euo pipefail

VERSION="${1:-v0.0.1}"
OWNER="ischung"
REPO="my-todo-vs"
IMAGE="ghcr.io/${OWNER}/${REPO}"

if [ -z "${KANBAN_TOKEN:-}" ]; then
  echo "❌ KANBAN_TOKEN 환경변수가 필요합니다."
  echo "   GitHub → Settings → Developer settings → Personal access tokens (classic) 에서"
  echo "   write:packages, read:packages 스코프 포함한 토큰을 생성/확장한 뒤:"
  echo "   export KANBAN_TOKEN=ghp_..."
  echo "   bash scripts/publish-ghcr.sh ${VERSION}"
  exit 1
fi

echo "▶ docker build → ${IMAGE}:${VERSION}"
docker build -t "${IMAGE}:${VERSION}" -t "${IMAGE}:latest" .

echo "▶ docker login ghcr.io (as ${OWNER})"
echo "${KANBAN_TOKEN}" | docker login ghcr.io -u "${OWNER}" --password-stdin

echo "▶ docker push ${IMAGE}:${VERSION}"
docker push "${IMAGE}:${VERSION}"
echo "▶ docker push ${IMAGE}:latest"
docker push "${IMAGE}:latest"

echo "▶ docker logout"
docker logout ghcr.io

cat <<EOF

✅ Push 완료!

다음 할 일 (GitHub UI에서 1회):
  1. https://github.com/users/${OWNER}/packages/container/${REPO}/settings
     → "Change package visibility" → Public 선택
  2. "Manage Actions access" → 리포지토리(${OWNER}/${REPO}) 연결

검증:
  docker logout
  docker pull ${IMAGE}:${VERSION}
  docker run -d -p 8080:8080 -v ./data:/app/data ${IMAGE}:${VERSION}
  open http://localhost:8080
EOF
