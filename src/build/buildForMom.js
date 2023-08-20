import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, rename } from 'fs';
import path, { dirname } from 'path';

const rootPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../..');
let content = '';
let targetPath = '';
// .env.production
targetPath = path.resolve(rootPath, '.env.production');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
writeFileSync(targetPath, content);

// deploy.sh  deploy.bat
targetPath = path.resolve(rootPath, 'deploy.sh');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
writeFileSync(targetPath, content);
targetPath = path.resolve(rootPath, 'deploy.bat');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
writeFileSync(targetPath, content);

// 404.html
targetPath = path.resolve(rootPath, '404.html');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/\/life/g, '/mom');
writeFileSync(targetPath, content);

// /api/stock.ts
targetPath = path.resolve(rootPath, 'src/api/stock.ts');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/apiPath = ''/, "apiPath = '2'");
writeFileSync(targetPath, content);

// /config/constant.ts
targetPath = path.resolve(rootPath, 'src/config/constant.ts');
content = readFileSync(targetPath, 'utf-8');
content = content.replace(/FEE_RATE = 0.001425 \* 0.28/, 'FEE_RATE = 0.001425 * 0.6');
writeFileSync(targetPath, content);

// /App.ts
targetPath = path.resolve(rootPath, 'src/App.tsx');
const originTargetPath = path.resolve(rootPath, 'src/AppMom.tsx');
rename(originTargetPath, targetPath, err => {
    if (err) {
        console.log('Error rename');
    } else {
        console.log('Successfully renamed the file!');
    }
});
