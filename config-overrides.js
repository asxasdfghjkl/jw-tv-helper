/* config-overrides.js */

const path = require('path');

module.exports = {
	paths: function (paths, env) {
		paths.appBuild = path.resolve(__dirname, 'dist');
		return paths;
	},
	webpack: function (config, env) {
		config.output.filename = 'js/app.js';
		config.optimization.splitChunks = {
			cacheGroups: { default: false },
		};
		config.optimization.runtimeChunk = false;
		return config;
	},
};
