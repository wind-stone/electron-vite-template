import type { ChildProcess } from 'child_process'
import { type UserConfig, type ViteDevServer, createServer as viteCreateServer, build as viteBuild, mergeConfig } from 'vite';
import chalk from 'chalk';
import { startElectron } from '../electron';
import { ElectronViteConfig } from '../interface';

let rendererDevServer: ViteDevServer | null;

/**
 * 启动 renderer 静态服务的 开发服务器
 */
const startRendererDevServer = async (viteConfig: UserConfig) => {
    rendererDevServer = await viteCreateServer({
        configFile: false, // 不使用配置文件，而是使用传入的配置
        ...viteConfig,
    });

    if (!rendererDevServer.httpServer) {
        throw new Error('HTTP server not available')
    }

    await rendererDevServer.listen()

    const config = rendererDevServer.config.server;
    const protocol = config.https ? 'https:' : 'http:';
    const port = config.port;
    process.env.ELECTRON_RENDERER_ORIGIN = `${protocol}//127.0.0.1:${port}`;

    console.log(chalk.green(`dev server running for the electron renderer process at:`));

    rendererDevServer.printUrls()
}

/**
 * 构建 Electron 代码 for dev 环境
 */
const buildDevElectron = async (viteConfig: UserConfig, watchHook: () => void, errorHook: (e: Error) => void): Promise<void> => {
    return new Promise(async resolve => {
        // 如果需要监听，则在 closeBundle 钩子调用后（此时构建已经结束）返回，否则，调用 build 结束后返回
        if (viteConfig.build?.watch) {
            console.log('+++ viteConfig.build?.watch', viteConfig.build?.watch)
            let firstBundle = true
            viteConfig = mergeConfig(viteConfig, {
                plugins: [
                    {
                        name: 'vite:electron-watcher',
                        closeBundle() {
                            if (firstBundle) {
                                firstBundle = false
                                resolve();
                            } else {
                                watchHook()
                            }
                        }
                    }
                ]
            })
        }

        try {
            await viteBuild(viteConfig);
            if (!viteConfig.build?.watch) {
                resolve();
            }
        } catch (e) {
            errorHook(e as Error)
        }
    })
}

/**
 * 构建 Electron main/preload 代码，并监听 main/preload 代码改动，重启对应服务；构建后，启动 Electron 服务
 */
const startElectronDevServer = async (electronViteConfig: ElectronViteConfig) => {
    let cp: ChildProcess;
    const errorHook = (e: Error): void => {
        console.error(`${chalk.bgRed(chalk.white(' ERROR '))} ${chalk.red(e.message)}`)
    }
    electronViteConfig.main.define = electronViteConfig.main.define || {};
    electronViteConfig.main.define['process.env.ELECTRON_RENDERER_ORIGIN'] = JSON.stringify(process.env.ELECTRON_RENDERER_ORIGIN);
    // 构建 Electron main，代码改动后，重新启动 Electron main 服务
    await buildDevElectron(electronViteConfig.main, () => {
        console.log(chalk.green(`\n rebuild the electron main process successfully!`))

        if (cp) {
            console.log(chalk.cyan(`\n waiting for electron to exit...`))
            cp.removeAllListeners()
            cp.kill()
            cp = startElectron('.');

            console.log(chalk.green(`\n restart electron app...`))
        }
    }, errorHook);
    console.log(chalk.green(`\n build the electron main process successfully!`));

    // 构建 Electron preload，代码改动后，重新加载 renderer 页面
    console.log(chalk.gray(`\n-------------------------\n`));
    await buildDevElectron(electronViteConfig.preload, async () => {
        console.log(chalk.green(`\n rebuild the electron preload process successfully!`));

        if (rendererDevServer) {
            console.log(chalk.cyan(`\n trigger renderer reload`))
            rendererDevServer.ws.send({ type: 'full-reload' })
        }
    }, errorHook);
    console.log(chalk.green(`\n build the electron preload files successfully!`));

    cp = startElectron('.')

    console.log(chalk.green(`\n start electron app...\n`))
}

/**
 * 启动开发阶段的服务
 */
export const startDevServer = async (electronViteConfig: ElectronViteConfig) => {
    // 设置环境变量，该变量可以用在 main/preload/renderer 里
    process.env.NODE_ENV_ELECTRON_VITE = 'development';

    await startRendererDevServer(electronViteConfig.renderer);

    await startElectronDevServer(electronViteConfig);
}
