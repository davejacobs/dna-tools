/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will
 * watch for changes and recompile as required.
 */

"use strict";

var path = require("path"),
    webpack = require("webpack");

module.exports = {
  output: {
    filename: "/boot.js",
    // Why is this required? Webpack is throwing errors when I don't
    // include it, but I don't think this absolute directory is real.
    path: "/",
    publicPath: "http://localhost:8081/assets/",
    sourceMapFilename: "[name].map"
  },

  cache: true,
  debug: true,
  devtool: false,

  entry: [
    "./src/client/boot.jsx",
    // "webpack/hot/dev-server",
    "webpack-dev-server/client?http://localhost:8081"
  ],

  stats: {
    colors: true,
    reasons: true
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // Don't load from server directory when using Webpack
    // (which is only used for the client).
    new webpack.IgnorePlugin(/^(\.\/)?server/)
  ],

  resolve: {
    modulesDirectories: [
      "node_modules",
      "src",
      "src/fonts",
      "node_modules/bootstrap-sass/assets/stylesheets",
      "node_modules/bootstrap-sass/assets/fonts",
      "config"
    ],

    alias: {
      "lib-components": "lib/components"
    }
  },

  module: {
    preLoaders: [{
      test: "\\.js$",
      exclude: "node_modules",
      loader: "jshint"
    }],

    loaders: [{
      test: /\.jsx$/,
      loader: "babel",
      exclude: /node_modules/
    }, {
        test: /\.md$/,
        loader: "html!markdown"
    }]
  }
};
