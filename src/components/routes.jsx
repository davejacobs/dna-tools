var React = require("react"),
    { Route, DefaultRoute } = require("react-router"),
    App = require("./app.jsx");

module.exports = (
  <Route handler={App.OneColumnLayout} path="/">
    <DefaultRoute handler={App.SearchPage} />
    <Route name="search" path="/search" handler={App.SearchPage} />
  </Route>
);

