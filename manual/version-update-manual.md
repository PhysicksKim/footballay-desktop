# 버전 업데이트

### 1. package.json 수정

`/release/app/package.json` 에서 version 변경

`package.json` 은 production version 으로 packaging 과정에서 버전 정보 제공에 관여함.

<br><br>

### 2. src/main/Constants.ts 에서 version 상수 수정

```javascript
const __APP_VERSION__ = '0.1.1';
export { __APP_VERSION__ };
```

위의 버전 상수는 앱에서 사용할 버전 표시에 관여함

위에서 `__APP_VERSION__` 을 수정하면 `preload.ts` 에서 `contextBridge.exposeInMainWorld('appVersion', __APP_VERSION__);` 를 통해 appVersion 을 제공해줌.  
app renderer page 에서 `SideNavigation.tsx` 에서 `const version = window.appVersion;` 를 통해 버전을 가져옴
