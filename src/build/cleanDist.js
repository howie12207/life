import { existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';

function deleteDir(url) {
    if (existsSync(url)) {
        const files = readdirSync(url);
        files.forEach(function (file) {
            const curPath = join(url, file);

            if (statSync(curPath).isDirectory()) {
                deleteDir(curPath);
            } else {
                unlinkSync(curPath);
            }
        });

        rmdirSync(url);
    } else {
        console.log('目錄不存在');
    }
}

deleteDir('./dist');
