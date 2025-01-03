<template>
    <button id="select-mini-game-btn" @click="onselectGame">选择小游戏项目</button>
</template>

<script setup lang="ts">
const onselectGame = () => {
    window.electronAPI.selectGame();
}
</script>
