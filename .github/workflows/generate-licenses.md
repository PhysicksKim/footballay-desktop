# 오픈소스 라이센스 정보 사용 가이드

이 문서는 오픈소스 라이센스 정보를 생성하고 사용하는 방법에 대해 설명합니다.

## 목차

1. [스크립트 동작 방식](#스크립트-동작-방식)
2. [다른 레포지토리에서 사용하기](#다른-레포지토리에서-사용하기)

## 스크립트 동작 방식

이 스크립트는 `scripts/generate-opensource-list.js` 파일에 위치하며, 다음과 같은 과정을 통해 오픈소스 라이센스 정보를 생성합니다:

1. **의존성 라이센스 정보 수집**:

   - `license-checker` 패키지를 사용하여 현재 프로젝트의 의존성에서 라이센스 정보를 수집합니다.
   - 수집된 정보는 JSON 형식으로 변환되어 저장됩니다.

2. **파일 생성**:

   - 수집된 라이센스 정보는 `dist/opensource-list-{projectName}.json` 형식의 파일로 저장됩니다.
   - 이 파일은 프로젝트의 이름을 포함하여 각 오픈소스 라이센스의 이름, 버전, 라이센스 타입, 저장소 URL 등을 포함합니다.

3. **CDN 업로드**:
   - 생성된 파일은 Cloudflare R2에 `footballay/licenses/opensource-list-{projectName}.json` 경로로 업로드됩니다.
   - 이를 통해 다른 개발자들이 쉽게 접근할 수 있도록 합니다.

## 다른 레포지토리에서 사용하기

이 스크립트를 다른 레포지토리에서 사용하려면 다음 단계를 따르세요:

1. **GitHub Secrets 설정**:

   - 각 레포지토리에서 다음과 같은 GitHub Secrets를 설정해야 합니다:
     - `R2_ACCOUNT_ID`: Cloudflare R2 계정 ID
     - `R2_ACCESS_KEY_ID`: Cloudflare R2 접근 키 ID
     - `R2_SECRET_ACCESS_KEY`: Cloudflare R2 비밀 접근 키
     - `R2_BUCKET_NAME`: Cloudflare R2 버킷 이름

2. **스크립트 추가**:

   - `scripts/generate-opensource-list.js` 파일을 레포지토리에 추가합니다.
   - `package.json`의 `scripts` 섹션에 다음 명령어를 추가합니다:
     ```json
     "generate-opensource-list": "node scripts/generate-opensource-list.js"
     ```

3. **GitHub Actions 설정**:

   - `.github/workflows/generate-opensource-list.yml` 파일을 추가하여, main 브랜치에 push될 때 자동으로 스크립트를 실행하고 결과를 R2에 업로드하도록 설정합니다.

4. **라이센스 정보 생성**:
   - `npm run generate-opensource-list` 명령어를 실행하여 오픈소스 라이센스 정보를 생성할 수 있습니다.

## 라이센스 정보 형식

라이센스 정보는 JSON 형식으로 저장되며, 다음과 같은 구조를 가집니다:

```json
{
  "projectName": "프로젝트 이름",
  "version": "프로젝트 버전",
  "description": "프로젝트 설명",
  "licenses": [
    {
      "name": "패키지 이름",
      "version": "패키지 버전",
      "license": "라이센스 타입",
      "repository": "저장소 URL",
      "licenseText": "라이센스 전문"
    }
  ],
  "generatedAt": "생성 시간"
}
```

## 라이센스 정보 사용 방법

### 1. 라이센스 정보 가져오기

```typescript
async function fetchLicenseInfo(projectName: string) {
  const response = await fetch(
    `https://your-cdn-url.com/footballay/licenses/opensource-list/${projectName}.json`
  );
  const licenseInfo = await response.json();
  return licenseInfo;
}
```

### 2. 라이센스 정보 표시하기

```typescript
function displayLicenses(licenseInfo: any) {
  const licenseSection = document.createElement('div');

  // 프로젝트 정보 표시
  const projectInfo = document.createElement('h2');
  projectInfo.textContent = `${licenseInfo.projectName} v${licenseInfo.version}`;
  licenseSection.appendChild(projectInfo);

  // 라이센스 목록 표시
  const licenseList = document.createElement('ul');
  licenseInfo.licenses.forEach((license: any) => {
    const item = document.createElement('li');
    item.textContent = `${license.name} v${license.version} - ${license.license}`;
    licenseList.appendChild(item);
  });
  licenseSection.appendChild(licenseList);

  return licenseSection;
}
```

## 라이센스 표시 의무

오픈소스 라이센스에 따라 다음과 같은 정보를 표시해야 합니다:

1. MIT 라이센스:

   - 저작권 고지
   - 라이센스 전문
   - 소프트웨어 이름과 버전

2. Apache 2.0 라이센스:

   - 저작권 고지
   - 라이센스 전문
   - 변경 사항 고지
   - 소프트웨어 이름과 버전

3. GPL 라이센스:
   - 저작권 고지
   - 라이센스 전문
   - 소프트웨어 이름과 버전
   - 소스 코드 제공 방법 안내

## 주의사항

1. 라이센스 정보는 정기적으로 업데이트되어야 합니다.
2. 모든 의존성 패키지의 라이센스를 확인하고 적절히 표시해야 합니다.
3. 라이센스 전문은 가능한 경우 원본을 유지해야 합니다.
4. 라이센스 정보는 사용자가 쉽게 접근할 수 있는 곳에 표시해야 합니다.
