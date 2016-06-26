import React from "react";
import Doc from "./Doc";
import Nav from "./Nav";

export default class ReactSwagger extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="container-body">
          <div className="container-fill-left" />
          <div className="container-nav">
            <Nav endpoint={ this.props.endpoint } api={ this.props.api } />
          </div>
          <div className="container-content">
            <Doc endpoint={ this.props.endpoint } api={ this.props.api } />
          </div>
          <div className="container-fill-right" />
        </div>
      </div>
    );
  }
}