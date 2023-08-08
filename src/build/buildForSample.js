import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import path, { dirname } from 'path';

const rootPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../..');
let content = '';
let targetPath = '';
// .env.production
targetPath = path.resolve(rootPath, '.env.production');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/sample');
writeFileSync(targetPath, content);

// deploy.sh  deploy.bat
targetPath = path.resolve(rootPath, 'deploy.sh');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/sample');
writeFileSync(targetPath, content);
targetPath = path.resolve(rootPath, 'deploy.bat');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/sample');
writeFileSync(targetPath, content);

// 404.html
targetPath = path.resolve(rootPath, '404.html');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/sample');
writeFileSync(targetPath, content);
