const { contextBridge, ipcRenderer } = require('electron');
// const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    getSimulatorUrl: (directory) => ipcRenderer.invoke('simulator:getSimulatorUrl', directory),
    getDevtoolsUrl: (simulatorUrl) => ipcRenderer.invoke('simulator:getDevtoolsUrl', simulatorUrl),
})
