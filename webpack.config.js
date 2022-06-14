const isMinify = !!process.env.BUILD_MINIFY;
const path = require('path');

module.exports = {
	context: __dirname + '/src',
	optimization: {
		minimize: isMinify,
	},
	entry: {
		BP2D: './2D',
		BP3D: './3D',
		BinPacking: './index.ts',
    },
    devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: isMinify ? '[name].min.js' : '[name].js',
		library: 'BinPacking',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		globalObject: 'this',
	},
	mode: isMinify ? 'production' : 'development',
};
