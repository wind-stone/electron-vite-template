import http from 'http';
import path from 'path';
import handler from 'serve-handler';

// TODO: 这个是运行时静态服务，需要动态监测端口是否可用
// 指定要监听的端口
const port = 3001;

export const createStaticServer = () => {
    // 创建 HTTP 服务器
    const server = http.createServer((request, response) => {
        // 使用 serve-handler 处理请求
        console.log('静态服务 server 地址', path.join(__dirname, '../temp-dir'))
        return handler(request, response, {
            // TODO: 线上环境的话，需要确定 小游戏 项目的存储路径，这里仅做 demo 用
            public: path.join(__dirname, '../temp-dir')
        });
    });

    // 监听指定端口
    server.listen(port, () => {
        console.log(`静态文件服务器已启动，监听端口 ${port}`);
    });
}

