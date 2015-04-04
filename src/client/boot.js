require("babel/register");

var React = require("react"),
    Router = require("react-router"),
    routes = require("../components/routes.js"),
    Fluxxor = require("fluxxor"),
    DnaStore = require("../stores/dna_store.js"),
    Actions = require("../actions.js");

var Stores = {
  dna: new DnaStore()
};

var flux = new Fluxxor.Flux(Stores, Actions);

window.router = Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler flux={flux} params={state.params} />, document.body)
});
