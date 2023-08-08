import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname } from 'path';

const buildTime = new Date().toISOString();

const rootPath = path.resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const indexPath = path.resolve(rootPath, 'dist/index.html');

let html = fs.readFileSync(indexPath, 'utf-8');
html = html.replace(
    '<!-- build time-->',
    `<script>
            (function () {
                console.info('ver: %c${buildTime}','color:white;background:#005598;padding: 0.1rem 0.5rem; border-radius: 0.6rem')
            })()
    </script>`
);
fs.writeFileSync(indexPath, html);
