import React from "react";
import favicon from "favicon.ico";
import { Link } from "react-router";
import InlineCss from "react-inline-css";
import colors from "material-colors";
import api from "../swagger";

export default class Nav extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={ Nav.css() } namespace="Nav">
        <h1>
          <img src={favicon} style={{ verticalAlign: 'middle', paddingRight: '0.25em', height: '1.5em' }}/>
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
      </InlineCss>
    );
  }

  static css() {
    return (`
      & a {
        color: ${colors.grey['50']};
        text-decoration: none; 
      }

			& .nav-links a {
        display: block;
        border-left: 1px solid ${colors.cyan['200']};
        padding: 0.25em 0em 0.25em 1em;
        text-decoration: none;
        word-wrap: break-word;
        white-space: pre-wrap;
        max-width: 20em;
				color: ${colors.cyan['200']};
			}

      & .selected-link {
        display: block;
        border-left: 1px solid ${colors.cyan['50']};
        padding: 0.25em 0em 0.25em 1em;
        word-wrap: break-word;
        white-space: pre-wrap;
        max-width: 20em;
				color: ${colors.cyan['50']};
			}

      & .nav-links a:hover {
        border-left: 1px solid ${colors.grey['50']};
        color: ${colors.grey['50']};
      }
		`);
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