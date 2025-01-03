import path from 'path';
import { BrowserWindow, ipcMain, dialog } from "electron";
import axios from "axios";

import { isDev, copyDir, rendererOriginInDev } from './utils';

// 打开特定小程序调试面板
function openGameWindow(dir) {
    let win: BrowserWindow | null = null;
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, '../preload/project-preload.js')
        }
    });
    win.maximize();

    if (isDev) {
        win.loadURL(`${rendererOriginInDev}/pages/project/index.html?directory=${encodeURIComponent(dir)}`);
    } else {
        win.loadFile(path.join(__dirname, '../renderer/pages/project/index.html'), {
            query: {
                directory: encodeURIComponent(dir)
            }
        });
    }

    ipcMain.handle('simulator:getSimulatorUrl', (event, directory) => {
        return `${rendererOriginInDev}/pages/simulator/index.html?directory=${directory}`;
    })

    ipcMain.handle('simulator:getDevtoolsUrl', async (event, directory) => {
        const res = await axios.get('http://localhost:9223/json');
        console.log('+++ simulator:getDevtoolsUrl directory', directory)
        console.log('+++ chrome devtools json', res.data)

        // 获取模拟器的 DevTools 的 url
        const browserDevtoolsFrontendUrl = res.data.find(item => item.url === directory)?.devtoolsFrontendUrl;
        const wsQueryString = browserDevtoolsFrontendUrl.split('inspector.html?')[1];
        const devToolsUrl = path.join(__dirname, '../../front_end/devtools_app.html') + '?' + wsQueryString;
        console.log('+++ devToolsUrl', devToolsUrl);
        return devToolsUrl;
    })
}

/**
 * 根据打开的小游戏目录，创建临时文件
 */
function createMiniGameDirectory(dir) {
    const directoryArray = dir.split('/');
    const directoryName = directoryArray[directoryArray.length - 1];

    const directoryPath = path.join(__dirname, '../temp-dir/' + directoryName)

    copyDir(dir, directoryPath, (err) => {
        if (err) {
            console.error('+++ 复制文件夹时出错:', err);
        } else {
            console.log('+++ 文件夹复制成功！');

            openGameWindow(dir);
        }
    })
}

/**
 * 添加选择游戏的监听
 */
export const addSelectGameListener = () => {
    ipcMain.on('select-game', async (event, browserSrc) => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        if (!canceled) {
            console.log('+++ filePaths', filePaths);
            createMiniGameDirectory(filePaths[0]);
        }
    })
}
