var Constants = require("./constants.js"),
    ClientData = require("./client/data.js");

module.exports = {
  loadDna(id) {
    this.dispatch(Constants.DNA.LOAD, { id: id });

    ClientData.loadDna(id).then((model) => {
      this.dispatch(Constants.DNA.LOAD_SUCCESS, { model: model });
    });
  },

  loadDnaCollection(search) {
    this.dispatch(Constants.DNA.LOAD_COLLECTION, { search: search });

    ClientData.loadDnaCollection(search).then((collection) => {
      this.dispatch(Constants.DNA.LOAD_COLLECTION_SUCCESS, {
        collection: collection 
      });
    });
  }
};
