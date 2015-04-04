var React = require("react/addons");

exports.Spinner = React.createClass({
  render() {
    var message = this.props.message ? <p className="message">{this.props.message}</p> : null;

    return (
      <div className="spinner">
        <img src="/assets/images/spinner.svg" />
        {message}
      </div>
    );
  }
});
