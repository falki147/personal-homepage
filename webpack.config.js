const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  entry: {
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
		  MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false }
          },
          "sass-loader",
        ],
      },
    ],
  },
};
