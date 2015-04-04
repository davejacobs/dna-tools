var keyMirror = (obj, namespace) => {
  namespace = namespace || [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === null) {
      obj[key] = namespace.concat([key]).join(":");
    } else if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
      obj[key] = keyMirror(obj[key], namespace.concat([key]));
    }
  }

  return obj;
};

module.exports = keyMirror({
  DNA: {
    LOAD: null,
    LOAD_SUCCESS: null,
    LOAD_COLLECTION: null,
    LOAD_COLLECTION_SUCCESS: null
  }
});
