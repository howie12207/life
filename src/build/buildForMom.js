import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname } from 'path';

const rootPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../..');
let content = '';
let targetPath = '';
// .env.production
targetPath = path.resolve(rootPath, '.env.production');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
fs.writeFileSync(targetPath, content);

// deploy.sh  deploy.bat
targetPath = path.resolve(rootPath, 'deploy.sh');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
fs.writeFileSync(targetPath, content);
targetPath = path.resolve(rootPath, 'deploy.bat');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
fs.writeFileSync(targetPath, content);

// 404.html
targetPath = path.resolve(rootPath, '404.html');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
fs.writeFileSync(targetPath, content);

// /api/stock.ts
targetPath = path.resolve(rootPath, 'src/api/stock.ts');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/apiPath = 'stock'/, "apiPath = 'stock2'");
fs.writeFileSync(targetPath, content);

// /config/constant.ts
targetPath = path.resolve(rootPath, 'src/config/constant.ts');
content = fs.readFileSync(targetPath, 'utf-8');
content = content.replace(/FEE_RATE = 0.001425 \* 0.28/, 'FEE_RATE = 0.001425 * 0.6');
fs.writeFileSync(targetPath, content);
