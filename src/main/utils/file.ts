import fs from 'fs';
import path from 'path';

export const copyDir = (src, dest, callback) => {
    fs.access(src, fs.constants.F_OK, (err) => {
        if (err) {
            callback(err);
            return;
        }

        fs.stat(src, (err, stats) => {
            if (err) {
                callback(err);
                return;
            }

            if (stats.isDirectory()) {
                // 递归删除目标文件夹
                const res = fs.rmSync(dest, {
                    force: true,
                    recursive: true
                });

                fs.mkdir(dest, { recursive: true }, (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    fs.readdir(src, (err, files) => {
                        if (err) {
                            callback(err);
                            return;
                        }

                        let completed = 0;

                        function onComplete() {
                            completed++;
                            if (completed === files.length) {
                                callback();
                            }
                        }

                        files.forEach(file => {
                            const srcPath = path.join(src, file);
                            const destPath = path.join(dest, file);

                            copyDir(srcPath, destPath, onComplete);
                        });
                    });
                });
            } else {
                fs.copyFile(src, dest, (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            }
        });
    });
}

