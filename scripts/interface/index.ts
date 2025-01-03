import { type UserConfig, type ModuleNode } from 'vite';

export type ViteMode = 'development' | 'production';
export type ViteCommand = 'serve' | 'build';

export interface ElectronViteConfig {
    renderer: UserConfig,
    main: UserConfig,
    preload: UserConfig,
}

export interface ElectronViteConfigParams {
    mode: ViteMode,
    command: ViteCommand,
}

export interface PackageJson {
    main?: string
    type?: 'module' | 'commonjs'
    dependencies?: Record<string, string>
}
