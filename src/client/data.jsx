// var Promise = require("promise"),
//     request = require("superagent");
//
// function resolveOrReject(resolve, reject) {
//   return function (resp) {
//     if (resp.statusType === 2 || resp.statusType === 3) {
//       resolve(resp.body);
//     } else {
//       reject(resp);
//     }
//   };
// }

// module.exports = {
//   loadDnaCollection(search) {
//     return new Promise((resolve, reject) => {
//       request.get("/api/dna").
//         query({ search: search }).
//         set("Accept", "application/json").
//         end(resolveOrReject(resolve, reject));
//     })
//   }
// }

var _ = require("underscore"),
    request = require("superagent"),
    Promise = require("promise"),
    { DOMParser } = require("xmldom"),
    xpath = require("xpath"),
    fasta = require("fasta-parser");

const ENTREZ_URL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const SEARCH_URL = `${ENTREZ_URL}/esearch.fcgi`; 
const FETCH_URL = `${ENTREZ_URL}/efetch.fcgi`;

function resolveOrReject(resolve, reject) {
  return function (resp) {
    if (resp.statusType === 2 || resp.statusType === 3) {
      resolve(resp);
    } else {
      reject(resp);
    }
  };
}

module.exports = {  
  loadDna(id) {},

  parseFastaSequence(text, many) {
    many = many || false;

    var fastaText = new Buffer(text),
        parser = fasta(),
        fastaResults = [];

    parser.on("data", (data) => {
      fastaResults.push(JSON.parse(data.toString()));
    });
    parser.write(fastaText);
    parser.end();

    if (many) {
      return fastaResults.map(r => r.seq);
    } else {
      return fastaResults[0].seq;
    }
  },

  parseGeneMetadata(text) {
    var xml, xmlPaths;
    
    xml = new DOMParser().parseFromString(text);
    xmlPaths = {
      base: [
        "//Entrezgene",
      ],
      common: [
        "Entrezgene_locus",
        "Gene-commentary",
        "Gene-commentary_seqs",
        "Seq-loc",
        "Seq-loc_int",
        "Seq-interval"
      ],
      start:      ["Seq-interval_from"],
      end:        ["Seq-interval_to"],
      identifier: ["Seq-interval_id", "Seq-id", "Seq-id_gi"],
      strand:     ["Seq-interval_strand", "Na-strand", "@value"],

      lineage: [
        // "Entrezgene_source",
        // "BioSource",
        // "Biosource_org",
        // "Org-ref",
        // "Org-ref_orgname",
        "//OrgName",
        "/OrgName_lineage"
      ],

      taxName: [
        // "Entrezgene_source",
        // "BioSource",
        // "Biosource_org",
        "//Org-ref",
        "/Org-ref_taxname"
      ],

      geneName: [
        // "Entrezgene_gene",
        "//Gene-ref",
        "/Gene-ref_locus"
      ],

      proteinName: [
        // "Entrezgene",
        // "Entrezgene_prot",
        "//Prot-ref",
        // "Prot-ref_name",
        "/Prot-ref_name_E"
      ]
    };

    var extract = (key, xml, opts) => {
      var defaults = {
        common: true,
        type: "data"
      };

      opts = _.extend({}, defaults, opts); 

      var path = xmlPaths[key]; 

      if (opts.common) {
        path = xmlPaths.common.concat(path);
      }

      var elem = xpath.select(path.join("/"), xml);

      if (opts.type === "data") {
        if (elem && elem.length) {
          return elem[0].firstChild.data;
        } else {
          return null;
        }
      } else {
        return elem.value;
      }
    };

    return xpath.select(xmlPaths.base.join("/"), xml).map((gene) => {
      try {
        return {
          seq_start:   parseInt(extract("start", gene), 10) + 1,
          seq_stop:    parseInt(extract("end", gene), 10) + 1,
          id:          extract("identifier", gene),
          strand:      extract("strand", gene, { type: "value" }),

          lineage:     extract("lineage", gene, { common: false }),
          taxName:     extract("taxName", gene, { common: false }),
          geneName:    extract("geneName", gene, { common: false }),
          proteinName: extract("proteinName", gene, { common: false })
        };
      } catch (e) {
        return null;
      }
    }).filter((g) => !!g);
  },

  loadGeneSequence(opts, many) {
    many = many || false;

    return new Promise((resolve, reject) => {
      request.get(FETCH_URL).
        query({ db: "nucleotide" }).
        query(opts).
        query({ rettype: "fasta" }).
        query({ retmode: "text" }).
        // Needed on server for multipart:
        // buffer().
        end(resolveOrReject(resolve, reject));
    }).then((resp) => this.parseFastaSequence(resp.text, many)).
      catch((resp) => console.warn("Request failed", resp));
  },

  loadGeneMetadata(opts) {
    return new Promise((resolve, reject) => {
      request.get(FETCH_URL).
        query({ db: "gene" }).
        query({ term: opts.search }).
        query({ retmode: "xml" }).
        query({ webenv: opts.cacheInfo.esearchresult.webenv }).
        query({ query_key: opts.cacheInfo.esearchresult.querykey }).
        end(resolveOrReject(resolve, reject));     
    }).then((resp) => {
      return this.parseGeneMetadata(resp.text)
    });
  },

  loadGenesFromSearch(search) {
    return new Promise((resolve, reject) => {
      request.get(SEARCH_URL).
        query({ db: "gene" }).
        query({ term: search }).
        query({ usehistory: "y" }).
        query({ retmode: "json" }).
        end(resolveOrReject(resolve, reject));
    }).then((resp) => {
      return resp.body;
    });
  },

  loadDnaCollection(search) {
    // var cacheDetails;

    return this.loadGenesFromSearch(search).then((cacheInfo) => {
      // cacheDetails = cacheInfo;

      return this.loadGeneMetadata({
        cacheInfo: cacheInfo,
        search: search
      });
    });
    // .then((metadataColl) => {
    //   return metadataColl.map((metadata) => {
    //     // _.extend(metadata, {
    //     //   webenv: cacheDetails.esearchresult.webenv,
    //     //   query_key: cacheDetails.esearchresult.querykey
    //     // });
    //
    //     return this.loadGeneSequence(metadata).then((sequence) => { 
    //       return _.extend({}, metadata, { sequence: sequence }); 
    //     });
    //   });
    // }).then((reqs) => {
    //   return Promise.all(reqs);
    // });
  }
};

