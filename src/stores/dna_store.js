var _ = require("underscore"),
    Fluxxor = require("fluxxor"),
    Constants = require("../constants.js"),
    Helpers = require("../lib/helpers.js");

module.exports = Fluxxor.createStore({
  initialize() {
    this.data = {
      meta: {
        currentModel: {
          loading: false,
          loaded: false
        },
        collection: {
          loading: false,
          loaded: false
        },
      },

      currentModel: {
        id: null,
        index: null
      },
      collection: []
    };

    console.log("Constants", Constants);

    this.bindActions(
      Constants.DNA.LOAD, this.onLoad,
      Constants.DNA.LOAD_SUCCESS, this.onLoadSuccess,
      Constants.DNA.LOAD_COLLECTION, this.onLoadCollection,
      Constants.DNA.LOAD_COLLECTION_SUCCESS, this.onLoadCollectionSuccess
    );
  },

  onLoad(id) {
    this.data.meta.currentModel.loading = true;
    this.data.meta.currentModel.loaded = false;

    this.emit("change");
  },

  onLoadSuccess(payload) {
    var idx = Helpers.addToCollectionOrUpdate(this.data.collection, payload.model);

    this.data.currentModel.id = payload.model.id;
    this.data.currentModel.index = index;

    this.data.meta.currentModel.loading = false;
    this.data.meta.currentModel.loaded = true;

    this.emit("change");
  },

  onLoadCollection(payload) {
    this.data.meta.collection.loading = true;
    this.data.meta.collection.loaded = false;

    this.emit("change");
  },

  onLoadCollectionSuccess(payload) {
    this.data.collection = payload.collection;

    this.data.meta.collection.loading = false;
    this.data.meta.collection.loaded = true;

    this.emit("change");
  },

  getState() {
    return this.data;
  }
});
