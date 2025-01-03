# electron-vite-template

本项目是开发【开发者工具】时做的 electron 14 + vue3 + vite 的模板，开发环境是参考的[electron-vite](https://cn.electron-vite.org/)来实现的。

之所以不直接使用 electron-vite，是因为该项目必须使用 electron 14，因此 NodeJS 版本为 14.19.3，导致只能使用 Vite2。（Vite3 需要 NodeJS v14.18）

模板实现的功能有：

- 开发环境
  - 使用 vite2 分别打包 renderer、main 和 preload
  - 热重载
    - renderer 代码修改，重新加载 renderer 页面
    - Electron preload 代码修改，重新加载 renderer 页面
    - Electron main 主进程代码修改，重启 electron 应用
