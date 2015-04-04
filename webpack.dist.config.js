/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

"use strict";

var webpack = require("webpack"),
    path = require("path");

module.exports = {
  output: {
    publicPatch: "assets/",
    path: "src/client/public/javascripts/",
    filename: "[hash].boot.js"
  },

  debug: false,
  devtool: false,
  entry: "./src/client/boot.js",

  stats: {
    colors: true,
    reasons: false
  },

  // Store away hash to properly link to index.js -- this links to a task
  storeStatsTo: "webpackStats",

  plugins: [
    // Don't include server dependencies
    new webpack.IgnorePlugin(/^(\.\/)?server/),
    new webpack.IgnorePlugin(/^(\.\/)?styles/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  resolve: {
    modulesDirectories: [
      "node_modules",
      "src"
    ]
  },

  module: {
    preLoaders: [{
      test: "\\.js$",
      exclude: "node_modules",
      loader: "jshint"
    }],

    loaders: [{
      test: /\.js[x]?$/,
      loader: "babel",
      exclude: /node_modules/
    }]
  }
};
