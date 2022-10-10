const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
	/**
	 * socket 数据发送接口
	 */
	app.use(createProxyMiddleware('/api', {
		target: 'http://10.88.1.101', // 目标地址
		changeOrigin: true, // needed for virtual hosted sites
		ws: true, // proxy websockets
		secure: false, // 验证SSL证书。应用于https
		// pathRewrite: {
		//     '^/custom': ''
		// }
	}));
	/**
	 * socket 测试
	 */
	app.use(createProxyMiddleware('/socket', {
		target: 'ws://127.0.0.1:7001',
		changeOrigin: true,
		secure: false,
		ws: true
	}));
};
