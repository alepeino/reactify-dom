var path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
		library: 'ReactifyDOM',
		libraryTarget: 'umd'
	},
	externals: {
		react: {
		  root: 'React',
		  amd: 'react',
		  commonjs: 'react',
		  commonjs2: 'react'
		},
		'react-dom': {
		  root: 'ReactDOM',
		  amd: 'react-dom',
		  commonjs: 'react-dom',
		  commonjs2: 'react-dom'
		}
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	}
}
