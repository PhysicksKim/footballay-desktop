# 환경 설정 가이드

프로젝트는 `devlocal`, `dev`, `prod` 3가지 스테이지를 지원합니다. 아래 예시 파일을 복사해 실제 `.env` 파일을 만들고 값만 수정하세요.

| 스테이지 | 예시 파일                  | 목적                             |
| -------- | -------------------------- | -------------------------------- |
| devlocal | `env/devlocal.env.example` | 로컬 백엔드 + localhost API      |
| dev      | `env/dev.env.example`      | 개발 서버 (`dev.footballay.com`) |
| prod     | `env/prod.env.example`     | 프로덕션 서버 (`footballay.com`) |

```bash
# 예시
cp env/devlocal.env.example .env.devlocal
```

새 `.env` 파일에는 최소한 아래 값이 필요합니다.

- `VITE_APP_ENV`: `devlocal` \| `dev` \| `prod`
- `VITE_DOMAIN_URL`: 레거시 API/정적 자원 호스트
- `VITE_API_URL`: v1 API 베이스 (devlocal에서는 `/api` prefix 포함)
- `VITE_WEBSOCKET_URL`: 웹소켓 엔드포인트

Vite 실행 시 `VITE_APP_ENV` 또는 `MODE` 값으로 스테이지가 결정됩니다. `local`이라는 이름은 예약어 충돌을 피하기 위해 사용하지 않습니다.

## Cloudflare Zero Trust (Dev 서버 전용)

개발 서버(`dev.footballay.com`)는 Cloudflare Zero Trust로 보호되어 있습니다. `npm run dev:dev` 실행 시 자동으로 인증 토큰을 주입하려면 루트에 `.env.secret` 파일을 만드세요:

```bash
# .env.secret (루트 디렉터리)
VITE_CF_ACCESS_CLIENT_ID=your-client-id.access
VITE_CF_ACCESS_CLIENT_SECRET=your-secret-here
```

- `.env.secret`은 `.gitignore`에 등록되어 있으므로 커밋되지 않습니다.
- 빌드(`npm run build:dev`)에는 포함되지 않으며, 빌드된 앱에서는 설정 탭에서 수동으로 입력할 수 있습니다.
- 프로덕션 빌드에서는 이 기능이 비활성화됩니다.
