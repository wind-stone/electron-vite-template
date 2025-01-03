/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
    // readonly VITE_APP_TITLE: string
    // readonly DEV: boolean;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
