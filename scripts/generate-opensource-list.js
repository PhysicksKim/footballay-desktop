/* eslint-env node */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 라이선스 파일 내용을 읽고 해시값을 생성하는 함수
const readLicenseFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 해시 계산용 정규화
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
    const hash = crypto
      .createHash('sha256')
      .update(normalizedContent)
      .digest('hex');
    // content는 원본 그대로 반환
    return { content, hash };
  } catch (error) {
    console.warn(
      `Warning: Could not read license file ${filePath}:`,
      error.message
    );
    return null;
  }
};

// 라이선스 정보를 정규화하는 함수
const normalizeLicenseInfo = (licenseInfo) => {
  const licenseMap = new Map();
  const uniqueLicenses = new Map();

  Object.entries(licenseInfo).forEach(([name, info]) => {
    if (!info.licenseFile) return;

    const licenseData = readLicenseFile(info.licenseFile);
    if (!licenseData) return;

    const { content, hash } = licenseData;
    const licenseKey = `${info.licenses}|${hash}`;

    if (!uniqueLicenses.has(licenseKey)) {
      uniqueLicenses.set(licenseKey, {
        license: info.licenses,
        content: content,
        packages: [],
      });
    }

    const packageInfo = {
      name: name.split('@')[0],
      version: name.split('@')[1],
      repository: info.repository,
      author: info.publisher || info.author || null,
    };

    uniqueLicenses.get(licenseKey).packages.push(packageInfo);
  });

  return Array.from(uniqueLicenses.values());
};

// 오픈소스 목록 생성
const generateOpenSourceList = () => {
  try {
    // package.json 읽기
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
    );

    // license-checker 실행 결과를 JSON으로 받기
    const licenseInfo = JSON.parse(
      execSync('npx license-checker --json --production', { encoding: 'utf8' })
    );

    // 라이선스 정보 정규화
    const normalizedLicenses = normalizeLicenseInfo(licenseInfo);

    // 최종 출력 형식
    const output = {
      projectName: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      licenses: normalizedLicenses,
      generatedAt: new Date().toISOString(),
    };

    // 결과를 파일로 저장
    const outputPath = path.join(
      __dirname,
      `../dist/opensource-list-${packageJson.name}.json`
    );
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    // R2에 업로드할 경로 설정
    const r2Path = `footballay/licenses/opensource-list-${packageJson.name}.json`;

    // 생성된 파일 경로를 출력
    console.log(`Generated file path: ${outputPath}`);
    console.log(`R2 upload path: ${r2Path}`);
  } catch (error) {
    console.error('Error generating open source list:', error);
    process.exit(1);
  }
};

generateOpenSourceList();
