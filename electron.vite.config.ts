
import type { ElectronViteConfigParams, ElectronViteConfig,} from './scripts/interface';
import type { ModuleFormat } from 'rollup';
import { resolve } from 'path';
import { builtinModules } from 'module';
import vue from '@vitejs/plugin-vue';
// import externals from 'rollup-plugin-node-externals'
import { externalizeDepsPlugin } from './scripts/utils';

export default async ({ command, mode }: ElectronViteConfigParams): Promise<ElectronViteConfig> => {
    const getRendererViteConfig = () => {
        const baseConfig = {
            base: './', // 静态资源的公共基础路径，这里 ./ 表示相对路径
            root: resolve(__dirname, 'src/renderer'),
            build: {
                outDir: resolve(__dirname, 'dist/renderer'), // 构建产出目录
                rollupOptions: {
                    input: {
                        renderer: resolve(__dirname, 'src/renderer/index.html'),
                        project: resolve(__dirname, 'src/renderer/pages/project/index.html'),
                        simulator: resolve(__dirname, 'src/renderer/pages/simulator/index.html'),
                    }
                },
            },
            resolve: {
                alias: {
                    '@renderer': resolve('src/renderer/')
                }
            },
            plugins: [vue()],
        };
        if (command === 'serve') {
            // dev 独有配置
            return {
                ...baseConfig,
            }
        } else {
            return {
                ...baseConfig
            }
        }

    };

    const getMainViteConfig = () => {
        const baseConfig = {
            mode,
            base: './', // 静态资源的公共基础路径，这里 ./ 表示相对路径
            root: resolve(__dirname, 'src/main'),
            build: {
                outDir: resolve(__dirname, 'dist/main'),
                emptyOutDir: true,
                target: 'node14.17',
                cssCodeSplit: false, // 禁用 CSS 代码拆分
                sourcemap: true, // 启用/禁用 sourcemap

                // 构建产出目录

                rollupOptions: {
                    // 入口文件
                    input: {
                        index: resolve(__dirname, 'src/main/index.ts'),
                    },
                    output: {
                        format: 'cjs' as ModuleFormat, // 输出格式
                        entryFileNames: '[name].js', // 输出文件名
                        assetFileNames: '[name].[ext]', // 资产文件名
                        dir: 'dist/main', // 生成目录
                    },
                },
                minify: false, // 暂时先不最小化混淆
                watch: mode === 'development' ? {
                    include: [
                        'src/main/**',
                    ]
                } : null, // 开发模式下启用 watch
            },
            plugins: [
                // externals({
                //     builtins: true,
                //     deps: true,
                //     devDeps: true,
                // })
                externalizeDepsPlugin({
                    include: [
                        ...builtinModules
                    ]
                }),
            ]
        };
        if (command === 'serve') {
            // dev 独有配置
            return {
                ...baseConfig,
            }
        } else {
            return {
                ...baseConfig
            }
        }
    };

    const getPreloadViteConfig = () => {
        const baseConfig = {
            mode,
            base: './', // 静态资源的公共基础路径，这里 ./ 表示相对路径
            root: resolve(__dirname, 'src/preload'),
            build: {
                outDir: resolve(__dirname, 'dist/preload'),
                emptyOutDir: true,
                target: 'node14.17',
                cssCodeSplit: false, // 禁用 CSS 代码拆分
                sourcemap: true, // 启用/禁用 sourcemap

                // 构建产出目录

                rollupOptions: {
                    // 入口文件
                    input: {
                        preload: resolve(__dirname, 'src/preload/preload.ts'),
                        'project-preload': resolve(__dirname, 'src/preload/pages/project/project-preload.ts'),
                        'simulator-preload': resolve(__dirname, 'src/preload/pages/simulator/simulator-preload.ts'),
                    },
                    output: {
                        format: 'cjs' as ModuleFormat, // 输出格式
                        entryFileNames: '[name].js', // 输出文件名
                        assetFileNames: '[name].[ext]', // 资产文件名
                        dir: 'dist/preload', // 生成目录
                    },
                },
                minify: false, // 暂时先不最小化混淆
                watch: mode === 'development' ? {
                    include: [
                        'src/preload/**',
                    ]
                } : null, // 开发模式下启用 watch
            },
            plugins: [
                externalizeDepsPlugin({
                    include: [
                        ...builtinModules
                    ]
                }),
            ]
        };
        if (command === 'serve') {
            // dev 独有配置
            return {
                ...baseConfig,
            }
        } else {
            return {
                ...baseConfig
            }
        }
    };

    return {
        renderer: getRendererViteConfig(),
        main: getMainViteConfig(),
        preload: getPreloadViteConfig(),
    }
}
