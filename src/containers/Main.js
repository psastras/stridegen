import React from "react";
import InlineCss from "react-inline-css";

/**
 * Main React application entry-point for both the server and client.
 */
export default class Main extends React.Component {
	render() {
		return (
			<InlineCss stylesheet={Main.css()} namespace="Main">
				<h1>Hello World!</h1>
			</InlineCss>
		);
	}

	static css() {
	/**
	 * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
	 * your component with `&` and its children with `& selectors`. Be specific.
	 */
		return (`
			& {
				font-family: sans-serif;
				color: #0df;
				padding: 10px 30px 30px;
				width: 443px;
				margin: 10px auto;
				background: #222;
			}
		`);
	}
}