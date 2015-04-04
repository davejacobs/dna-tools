var webpackDistConfig = require("./webpack.dist.config.js"),
    fs = require("fs"),
    path = require("path");
    // expandHomeDir = require("expand-home-dir");

module.exports = function (grunt) {
  require("load-grunt-tasks")(grunt);
  var pkgConfig = grunt.file.readJSON("package.json");

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,

      dist: {
        cache: false
      }
    },

    watch: {
      sass: {
        files: [
          "<%= pkg.src %>/client/styles/**/*.scss",
          "<%= pkg.src %>/components/*.scss"
        ],
        tasks: ["sass:dev"],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      options: {
        includePaths: [
          "<%= pkg.src %>/client/styles",
          "<%= pkg.src %>/components",
          path.join(__dirname, "node_modules"),
          path.join(__dirname, "/node_modules/node-bourbon/assets/stylesheets")
        ]
      },

      dev: {
        options: {
          sourceMap: true,
        },

        files: {
          "<%= pkg.src %>/client/public/styles/screen.css":
            "<%= pkg.src %>/client/styles/screen.scss"
        }
      },

      dist: {
        options: {
          outputStyle: "compressed",
        },

        files: {
          "<%= pkg.src %>/client/public/styles/screen.css":
            "<%= pkg.src %>/client/styles/screen.scss"
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ["last 2 versions"]
      },
      dist: {
        files: {
          "<%= pkg.src %>/client/public/styles/screen.css":
            "<%= pkg.src %>/client/public/styles/screen.css"
        }
      }
    }
  });

  grunt.registerTask("serve", ["sass:dev", "watch"]);

  // Need to add back for webpack dist
  // grunt.registerTask("build", ["clean", "sass", "autoprefixer", "webpack", "store-hash", "copy"]);
  // grunt.registerTask("deploy", ["build", "ssh_deploy:production", "clean"]);
};

