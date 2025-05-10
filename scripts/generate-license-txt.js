/* eslint-env node */
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootDir = path.resolve(__dirname, '..');

const __outputDir = '/dist/licenses/';
const __outputFileName = 'license.txt';
const __packageJsonPath = path.join(__rootDir, 'package.json');

const __opensourceListFileName = 'opensource-list-footballay-desktop.json';

const getAppName = () => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(__packageJsonPath, 'utf8'));
    return packageJson.name;
  } catch (error) {
    console.error('Error getting app name:', error);
    console.log('Fallback to default app name: footballay-desktop');
    return 'footballay-desktop';
  }
};

const generateLicenseFile = () => {
  try {
    const appName = getAppName();

    // 1. 앱 라이선스 읽기
    const appLicense = fs.readFileSync(
      path.join(__rootDir, 'LICENSE'),
      'utf-8'
    );

    // 2. 오픈소스 라이선스 목록 읽기
    const opensourceList = JSON.parse(
      fs.readFileSync(
        path.join(__rootDir, __outputDir, __opensourceListFileName),
        'utf-8'
      )
    );

    // 3. 라이선스 파일 내용 구성
    const licenseContent = `============================================
Footballay Desktop - MIT License
============================================
${appLicense}
  
============================================
Open Source License Notices
============================================
This software includes the following open source components:
  
${opensourceList.licenses
  // packages 배열에서 name이 appName인 경우 필터링
  .filter((license) => !license.packages.some((pkg) => pkg.name === appName))
  .map(
    (license) => `
${license.license}
${license.packages
  .map((pkg) => `${pkg.name} ${pkg.version} ${pkg.author} ${pkg.repository}`)
  .join('\n')}
${license.content ? `${license.content}\n` : ''}
`
  )
  .join('\n')}`;

    // 4. 라이선스 파일 저장
    const outputPath = path.join(__rootDir, __outputDir, __outputFileName);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, licenseContent);
    console.log('Successfully license.txt file generated at:', outputPath);
  } catch (error) {
    console.error('Error generating license file:', error);
    process.exit(1);
  }
};

generateLicenseFile();
