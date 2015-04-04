var path = require("path"),
    fs = require("fs"),
    React = require("react"),
    Router = require("react-router"),
    routes = require("../../components/routes.js"),
    Actions = require("../../actions.js"),
    hashPath = path.resolve(__dirname, "../../../hash.json"),
    hash;

if (fs.existsSync(hashPath)) {
  hash = fs.readFileSync(hashPath);
}

module.exports = (req, resp, next) => {
  resp.render("index", {
    title: "DNA Tools",
    hash: hash,
    env: process.env.NODE_ENV || "development"
  });
};

