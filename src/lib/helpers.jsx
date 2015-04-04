var _ = require("underscore");

module.exports = {
  // Finds a model by ID in a collection and updates its
  // attributes, or appends to the end.
  // Returns the index where the model lives at the end of the method.
  addToCollectionOrUpdate(coll, model) {
    var { id } = model,
        collModel = _.findWhere(coll, { id: id });
        idx = coll.indexOf(collModel);

    if (idx > -1) {
      _.extend(coll[idx], model);
    } else {
      coll.push(model);
    }
  }
};
