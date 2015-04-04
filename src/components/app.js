var _ = require("underscore"),
    React = require("react/addons"),
    cx = React.addons.classSet,
    Fluxxor = require("fluxxor"),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    { RouteHandler } = require("react-router"),
    { Spinner } = require("./spinners");

var Nucleotide = React.createClass({
  render() {
    return <li className="nucleotide">{this.props.n}</li>;
  }
});

var Sequence = React.createClass({
  render() {
    var {padding, seq} = this.props;

    return (
      <ul className="sequence">
        {seq.map((n) => <Nucleotide n={n} />)}
      </ul>
    );
  }
});

var SearchResult = React.createClass({
  render() {
    var {id, seq_start, seq_stop, strand,
      sequence, lineage, taxName, geneName, proteinName} = this.props.model;

    // Need to check for strand
    if (id && seq_start && seq_stop) {
      return (
        <li className="search-result">
          <h5 className="title">{geneName} – {taxName}</h5>
          <h6>Encodes {proteinName}</h6>

          <div className="metadata">
            <a href={`http://www.ncbi.nlm.nih.gov/nuccore/${id}`}>
              Sequence: {id} / {seq_start}:{seq_stop} (strand)
            </a>
          </div>
          {/* <ul className="lineage">
            {lineage.split(";").map((e) => <li><a className="pure-button button-small">{e}</a></li>)}
          </ul> */}
        </li>
      );
    } else {
      return null;
    }
  }
});

var SearchResults = React.createClass({
  render() {
    if (this.props.collection.length) {
      return (
        <ul className="search-results">
          {this.props.collection.map((s) => <SearchResult model={s} />)}
        </ul>
      );
    } else {
      return null;
    }
  }
});

var SearchBox = React.createClass({
  mixins: [FluxMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState() {
    return {
      search: ""
    };
  },

  render() {
    var classes = cx({
      "alone": this.props.isAlone,
      "search-box": true,
      "pure-form": true
    });

    return (
      <form className={classes} onSubmit={this.onSubmit}>
        <input name="search"
               value={this.state.search}
               placeholder="Gene Name"
               onChange={this.onChangeSearch} />
      </form>
    );
  },

  onChangeSearch(e) {
    this.setState({ search: e.target.value });
  },

  onSubmit(e) {
    // A little ironic... #singlepageapp
    e.preventDefault();
    this.context.router.transitionTo(`/search?query=${this.state.search}`);
  }
});

exports.SearchPage = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("dna")],

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {
    var searchOrSpinner;

    if (this.state.meta.collection.loading) {
      searchOrSpinner = <Spinner message="Loading" />
    } else {
      searchOrSpinner = [
        <SearchBox isAlone={this.state.collection.length == 0} />,
        <SearchResults collection={this.state.collection} />
      ];
    }

    return (
      <div className="search-page">
        <h2 className="curly-signature">Gene Search</h2>
        {searchOrSpinner}
      </div>
    );
  },

  getStateFromFlux: function() {
    return this.getFlux().store("dna").getState();
  },

  // We need to loadSearchFromQuery on first mount and on
  // subsequent URL changes, and this seems to be the current best way
  // to do that with React Router.
  componentDidMount() {
    this.loadSearchFromQuery();
  },

  componentWillReceiveProps() {
    this.loadSearchFromQuery();
  },

  loadSearchFromQuery() {
    var search = this.context.router.getCurrentQuery().query;

    if (search) {
      this.getFlux().actions.loadDnaCollection(search);
    }
  }
});

exports.OneColumnLayout = React.createClass({
  render() {
    return (
      <div className="one-column-layout">
        <RouteHandler {...this.props} />
      </div>
    );
  }
});

