import React from "react";
import InlineCss from "react-inline-css";
import colors from "material-colors";

import Doc from "components/Doc";
import Nav from "components/Nav";

export default class Main extends React.Component {

	render() {
		return (
			<InlineCss stylesheet={ Main.css() } namespace="Main"  key={this.props.routeParams.endpoint} >
				<div className="container">
					<div className="container-body">
						<div className="container-fill-left" />
						<div className="container-nav">
							<Nav {...this.props} />
						</div>
						<div className="container-content">
							<Doc className="container-content" {...this.props}/>
						</div>
						<div className="container-fill-right" />
					</div>
				</div>
			</InlineCss>
		);
	}

	static css() {
		return (`
			& {
				font-family: 'Open Sans', 'Helvetica', sans-serif;
			}

			& h1 {
				padding: 0 0 0.25em;
				font-weight: normal;
				margin: 0;
			}

			& h2 {
				padding: 0 0 0.5em;
				font-weight: normal;
				margin: 0;
			}

			& h3 {
				padding: 0 0 0.25em;
				font-weight: normal;
				margin: 0;
			}

			& .container {
				display: flex;
				min-height: 100vh;
				width: 100%;
				background: ${colors.grey['50']};
				flex-direction: column;
			}

			& .container-body {
				display: flex;
				flex: 1;
			}

			& .container-content {
				flex: 5;
				max-width: 1000px;
				padding: 1em 3em;
			}

			& .container-nav {
				flex: 0 0 20em;
				order -1;
				color: ${colors.grey['50']};
				background: ${colors.grey['900']};
				padding: 1em 3em;
			}

			& .container-fill-left {
				flex: 1;
				background: ${colors.grey['900']};
			}

			& .container-fill-right {
				flex: 1;
				background: ${colors.grey['50']};
			}

			& code {
				font-family: 'Consolas', 'Menlo', monospace;
				border-radius: 0.5em;
				font-size: 0.8em;
				padding: 0.5em;
				border: 1px solid ${colors.grey['200']};
			}

		`);
	}
}