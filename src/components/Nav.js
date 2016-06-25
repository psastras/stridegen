import React from "react";
import favicon from "favicon.ico";
import { Link } from "react-router";
import InlineCss from "react-inline-css";
import colors from "material-colors";

export default class Nav extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={ Nav.css() } namespace="Nav">
        <h1>
          <img src={favicon} style={{ verticalAlign: 'middle', paddingRight: '0.25em', height: '1.5em' }}/>
          <Link to='/'>Stride Docs</Link>
        </h1>
        <h2>API</h2>
        <div className="nav-links">
          <Link to='/docs/foo%2Fbar'>foo/bar</Link>
          <Link to='/docs/foo%2Fbar2'>foo/bar2</Link>
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

      & .nav-links a:hover {
        border-left: 1px solid ${colors.grey['50']};
        color: ${colors.grey['50']};
      }
		`);
  }
}