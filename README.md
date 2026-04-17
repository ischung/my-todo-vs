# my-todo-vs — 날짜별 할일 관리 앱

캘린더에서 날짜를 선택하여 그날의 할일을 등록·조회·수정·삭제할 수 있는 교육용 풀스택 웹 앱.

## 구성

- **아키텍처**: 3-tier + Containerized Monolith (Express가 SPA + API를 한 컨테이너에서 서빙)
- **배포**: GHCR(GitHub Container Registry) 기반 — 이미지가 곧 배포물
- **외부 의존**: 없음 (GitHub 생태계 완결, `GITHUB_TOKEN`만 사용)

## 폴더 구조

```
my-todo-vs/
├── frontend/         # React 18 + Vite + Tailwind (SPA)
├── backend/          # Express + better-sqlite3 (API + SPA 서빙)
├── e2e/              # Playwright (추후 추가)
├── .github/
│   └── workflows/    # CI/CD (추후 추가)
├── todo-calendar-prd.md       # PRD
├── todo-calendar-techspec.md  # TechSpec v0.3
└── issues.md                  # 구현 이슈 목록 (18개)
```

## 실행 방법

> ⚠️ 현재 스캐폴드만 완성된 상태입니다. 각 워크스페이스의 실제 코드는 후속 이슈에서 채워집니다.

### 로컬 개발 (추후)

```bash
# Node 20 사용
nvm use
npm install

# 백엔드 (포트 8080)
npm run dev:backend

# 프론트엔드 (포트 5173)
npm run dev:frontend
```

### Docker 실행 ✅ (issue #6 완료)

```bash
# 한 번에 빌드 + 기동
docker compose up --build

# 브라우저
open http://localhost:8080
```

또는 Docker CLI 직접 사용:
```bash
docker build -t my-todo-vs:dev .
docker run -d -p 8080:8080 -v $(pwd)/data:/app/data my-todo-vs:dev
```

- 로컬 SQLite 파일: `./data/todo.db` (컨테이너의 `/app/data`에 bind-mount)
- Healthcheck: 30초 간격 `/api/health` 호출
- 이미지 크기: ~225MB (better-sqlite3 native 포함)

### GHCR 이미지 사용 (추후, issue #7 완료 후)

```bash
docker pull ghcr.io/ischung/my-todo-vs:stable
docker run -d -p 8080:8080 -v ./data:/app/data ghcr.io/ischung/my-todo-vs:stable
```

## 개발 워크플로우

- **이슈 관리**: [GitHub Projects — My Todo Calendar](https://github.com/users/ischung/projects/17)
- **Git 전략**: GitHub Flow (`main` 보호 + feature 브랜치 + PR 머지)
- **CI/CD**: GitHub Actions (lint → test → security scan → Docker build + Trivy → GHCR push → image smoke)

## 문서

- [PRD](./todo-calendar-prd.md) — 제품 요구사항
- [TechSpec v0.3](./todo-calendar-techspec.md) — 기술 명세
- [Issues](./issues.md) — 구현 이슈 18개

## 라이선스

MIT
