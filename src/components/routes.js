var { Route, DefaultRoute } = require("react-router"),
    { OneColumnLayout } = require("./layouts"),
    { SearchPage } = require("./dna");

module.exports = (
  <Route handler={OneColumnLayout} path="/">
    <DefaultRoute handler={SearchPage} />
    <Route name="search" path="/search" handler={SearchPage} />
  </Route>
);
