const path = require('path');
module.exports = {
	entry: "./src/index",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].js"
	},
	module: {
		rules: [
			{ test: /\.jsx?$/, use: "babel-loader" }
		]
	}
}