const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const selectMiniGameBtn = document.getElementById('select-mini-game-btn');

    selectMiniGameBtn.addEventListener('click', () => {
        ipcRenderer.send('select-mini-game');
    })
})

