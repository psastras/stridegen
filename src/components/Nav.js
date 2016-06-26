import React from "react";
import { Link } from "react-router";

export default class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
        <h1>
          <Link to='/'>{this.props.api.getTitle()}</Link>
        </h1>
        <div className="nav-links">
          {this.props.api.getPaths().map((path) => {
            return (
              <SelectableLink endpoint={this.props.endpoint} path={path} key={this.props.api.getFullPath(path)} to={`/docs/${encodeURIComponent(path)}`} text={`${this.props.api.getFullPath(path)}`} />
            );
          })}
        </div>
      </div>
    );
  }
}

class SelectableLink extends React.Component {
  render() {
    return (
      this.props.endpoint === this.props.path ?  
      <div className="selected-link">{this.props.text}</div> :
      <Link to={this.props.to}>{this.props.text}</Link>
    );
  }
}