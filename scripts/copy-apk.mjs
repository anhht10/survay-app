import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceApk = path.join(projectRoot, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const publicDir = path.join(projectRoot, 'public', 'downloads');
const targetApk = path.join(publicDir, 'app-release.apk');

fs.mkdirSync(publicDir, { recursive: true });

if (!fs.existsSync(sourceApk)) {
  console.warn(`[apk:copy] Không tìm thấy APK release: ${sourceApk}`);
  console.warn('[apk:copy] Hãy build release APK trước rồi chạy lại npm run build hoặc npm run apk:copy');
  process.exit(0);
}

fs.copyFileSync(sourceApk, targetApk);
console.log(`[apk:copy] Đã copy APK sang ${targetApk}`);