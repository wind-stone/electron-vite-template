import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { getPackageJson } from '../utils';

const checkElectronEntryFile = (root = process.cwd()): void => {
    if (process.env.ELECTRON_ENTRY) return
    const packageJson = getPackageJson(root);
    if (!packageJson.main) {
        throw new Error('No entry point found for electron app, please add a "main" field to package.json!')
    }

    const entryPath = path.resolve(root, packageJson.main)
    console.log('+++ entryPath', entryPath);
    if (!fs.existsSync(entryPath)) {
        throw new Error(`No electron app entry file found: ${entryPath}`)
    }
}

/**
 * 启动 Electron 服务
 */
export const startElectron = (root: string) => {
    checkElectronEntryFile();

    const ps = spawn('electron', [root], { stdio: 'inherit' })
    ps.on('close', process.exit)

    return ps;
}
