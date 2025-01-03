import { startDevServer } from './server';
import { getElectronViteConfig } from '../utils';

;(async () => {
    // 获取 electron.vite.config.ts 下的配置
    const viteConfig = await getElectronViteConfig({
        command: 'serve',
        mode: 'development',
    });

    // 启动 electron + renderer 静态服务
    await startDevServer(viteConfig);
})()
