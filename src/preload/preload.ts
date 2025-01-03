const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    selectGame: () => ipcRenderer.send('select-game')
})
