var express = require("express"),
    router = express.Router(),
    Data = require("../data.js");

// router.get("/dna/:id", (req, resp) => {
//   Data.loadDna(req.params.id).
//     then((seq) => resp.json(seq));
// });
//
// router.get("/dna", (req, resp) => {
//   Data.loadDnaCollection(req.query.search).
//     then((collection) => resp.json(collection));
// });

module.exports = router;
