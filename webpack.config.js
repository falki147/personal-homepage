const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  entry: {
    main: [ './src/js/index.js', './src/css/index.scss' ],
    fps6: './src/js/fps6.js',
    GMLAST: [ './src/js/GMLAST.js', './src/css/GMLAST.scss' ]
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
