import { type Plugin, mergeConfig } from 'vite'
import { getPackageJson } from './index';

export interface ExternalOptions {
    exclude?: string[]
    include?: string[]
}

/**
 * 自动将依赖外部化，比如 package.json 的 dependencies 里的依赖，以及通过该插件 include 及 exclude 的依赖
 */
export function externalizeDepsPlugin(options: ExternalOptions = {}): Plugin {
    const { exclude = [], include = [] } = options;

    const packageJson = getPackageJson() || {}
    let deps = Object.keys(packageJson.dependencies || {})

    if (include.length) {
        deps = deps.concat(include.filter(dep => dep.trim() !== ''))
    }

    if (exclude.length) {
        deps = deps.filter(dep => !exclude.includes(dep))
    }

    deps = [...new Set(deps)]

    return {
        name: 'vite:externalize-deps',
        enforce: 'pre',
        config(config): void {
            const defaultConfig = {
                build: {
                    rollupOptions: {
                        external: deps.length > 0 ? [...deps, new RegExp(`^(${deps.join('|')})/.+`)] : []
                    }
                }
            }
            const buildConfig = mergeConfig(defaultConfig.build, config.build || {})
            console.log('+++ buildConfig', buildConfig, config);
            config.build = buildConfig
        }
    }
}
