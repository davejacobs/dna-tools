require("babel/register");

var express = require("express"),
    ecstatic = require("ecstatic"),
    path = require("path"),
    proxy = require("proxy-middleware"),
    url = require("url"),
    compress = require("compression"),
    // favicon = require("serve-favicon"),
    logger = require("morgan"),
    bodyParser = require("body-parser"),
    renderRoutes = require("./routes/render.js"),
    apiRoutes = require("./routes/api.js");

var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(compress());

// if (app.get("env") === "development") {
//   app.use(favicon(path.resolve(__dirname, "../client/public/images/favicon.png")));
// } else {
//   app.use(favicon(path.resolve(__dirname, "../../public/images/favicon.png")));
// }

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/assets/images",
        express.static(path.resolve(__dirname, "../client/public/images")));

if (app.get("env") === "development") {
  app.use("/assets/javascripts",
          proxy(url.parse("http://localhost:8081/assets/javascripts")));
  app.use("/assets",
          ecstatic({ root: path.resolve(__dirname, "../client/public") }));
} else {
  app.use("/assets",
          ecstatic({ root: path.resolve(__dirname, "../client/public") }));
}

app.use("/api", apiRoutes);
app.use("/", renderRoutes);

// Catch 404 and forward to error handler
app.use(function(req, resp, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  // Development error handler - will print stacktrace
  app.use(function(err, req, resp, next) {
    console.error(err.stack);
    resp.status(err.status || 500);
    resp.render("error", {
      message: err.message,
      error: err.stack
    });
  });
} else {
  // Production error handler - no stacktraces leaked to user
  app.use(function(err, req, resp, next) {
    console.log("[error] " + err);
    console.log(err.stack);
    resp.status(err.status || 500);
    resp.render("error", {
      message: err.message,
      error: {}
    });
  });
}

var port = process.env.PORT || 3001;
app.listen(port);
console.log("Express server is listening on port " + port);

// Run asset server
if (app.get("env") === "development") {
  var WebpackDevServer = require("webpack-dev-server"),
      webpackDevConfig = require("../../webpack.config"),
      webpack = require("webpack");

  var wpc = webpack(webpackDevConfig),
      assetServer = new WebpackDevServer(wpc, {
        contentBase: path.resolve(__dirname,
                                  "../client/public/javascripts"),
        quiet: false,
        noInfo: false,
        hot: false,
        publicPath: "/assets/javascripts",
        stats: {
          colors: true,
          reasons: true,
          exclude: [/node_modules/]
        }
      });

  assetServer.listen(8081, "localhost", function() {});
}
