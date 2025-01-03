<template>
    <div class="container">
        <webview ref="sumulatorDom" id="simulator" :src="simulatorUrl"></webview>
        <webview id="devtools" :src="devtoolsUrl"></webview>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
console.log('+++ window.location.search', window.location.search);
const urlParams = new URLSearchParams(window.location.search);
const directory = urlParams.get('directory');

const sumulatorDom = ref();
const simulatorUrl = ref('');
const devtoolsUrl = ref('');

onMounted(async () => {
    simulatorUrl.value = await window.electronAPI.getSimulatorUrl(directory);

    sumulatorDom.value.addEventListener('dom-ready', async () => {
        if (simulatorUrl.value) {
            const devtoolsAbsolutePath = await window.electronAPI.getDevtoolsUrl(simulatorUrl.value);
            devtoolsUrl.value = `file://${devtoolsAbsolutePath}`;
        }
    });
})
</script>

<style lang="less">
body, #app {
    height: 100vh;
}
</style>
<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    background: red;
}

webview {
    display: flex;
}

#simulator {
    width: 50%;
    height: 100%;
}

#devtools {
    width: 50%;
    height: 100%;
}
</style>
