var React = require("react"),
    { RouteHandler } = require("react-router");

exports.OneColumnLayout = React.createClass({
  render() {
    return (
      <div className="one-column-layout">
        <RouteHandler {...this.props} />
      </div>
    );
  }
});
