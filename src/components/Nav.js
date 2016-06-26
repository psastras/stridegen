import React from "react";
import favicon from "../images/favicon.ico";
import { Link } from "react-router";
import api from "../swagger";

export default class Nav extends React.Component {
  render() {
    return (
      <div className="nav">
        <h1>
          <img src={'/' + favicon} style={{ verticalAlign: 'middle', paddingRight: '0.25em', height: '1.5em' }}/>
          <Link to='/'>{api.getTitle()}</Link>
        </h1>
        <p>{api.getDescription()}</p>
        <h2>{api.getVersion()}</h2>
        <div className="nav-links">
          {api.getPaths().map((path) => {
            return (
              <SelectableLink endpoint={this.props.params.endpoint} path={path} key={api.getFullPath(path)} to={`/docs/${encodeURIComponent(path)}`} text={`${api.getFullPath(path)}`} />
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