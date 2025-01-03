import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from 'path';
import { addSelectGameListener } from './project';
import { isDev, createStaticServer, rendererOriginInDev } from './utils';

app.commandLine.appendSwitch('remote-debugging-port', '9223');
// app.commandLine.appendSwitch('remote-allow-origins', 'http://localhost:9223');
app.commandLine.appendSwitch('remote-allow-origins', 'file://');

app.whenReady().then(() => {
    // 先启动一个静态服务器
    createStaticServer();

    let win: BrowserWindow | null = null;
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, '../preload/preload.js')
        }
    });

    if (isDev) {
        win.loadURL(`${rendererOriginInDev}/index.html`);
    } else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    addSelectGameListener();
})
