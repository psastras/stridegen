import babelPolyfill from "babel-polyfill";
import koa from "koa";
import koaProxy from "koa-proxy";
import koaStatic from "koa-static";
import React from "react";
import ReactDOM from "react-dom/server";
import * as ReactRouter from "react-router";
import Transmit from "react-transmit";

import routesContainer from "containers/routes";
import favicon from "favicon.ico";

try {
	const app      = koa();
	const hostname = process.env.HOSTNAME || "localhost";
	const port     = process.env.PORT || 8000;
	let   routes   = routesContainer;

	app.use(koaStatic("static"));

	app.use(function *(next) {
		yield ((callback) => {
			const webserver = __PRODUCTION__ ? "" : `//${this.hostname}:8080`;
			const location  = this.path;

			ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
				if (redirectLocation) {
					this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
					return;
				}

				if (error || !renderProps) {
					callback(error);
					return;
				}

				const Root = React.createClass({
					render () {
						return <ReactRouter.RouterContext {...this.props} />;
					}
				});

				Transmit.renderToString(Root, renderProps).then(({reactString, reactData}) => {
					let template = (
					 `<!doctype html>
						<html lang="en-us">
							<head>
								<meta charset="utf-8" />
								<title>stride</title>
								<style>
									body { margin: 0; padding: 0 } 
								  .fade-appear { opacity: 0.01 }
								  .fade-appear.fade-appear-active { opacity: 1; transition: opacity .25s ease-in }
							    .fade-enter { opacity: 0.01 }
								  .fade-enter.fade-enter-active { opacity: 1; transition: opacity 250ms ease-in }
							    .fade-leave { opacity: 1 }
									.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity 150ms ease-in }
							  </style>
								<link href="https://fonts.googleapis.com/css?family=Open+Sans:300" rel="stylesheet">
								<link rel="shortcut icon" href="${favicon}" />
							</head>
							<body>
								<div id="react-root">${reactString}</div>
							</body>
						</html>`
					);

					this.type = "text/html";
					this.body = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);

					callback(null);
				}).catch(e => {
					callback(e);
				});
			});
		});
	});

	app.listen(port, () => {
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to http://%s:%s", hostname, port);
	});

	if (__DEV__) {
		if (module.hot) {
			console.log("[HMR] Waiting for server-side updates");

			module.hot.accept("containers/routes", () => {
				routes = require("containers/routes");
			});

			module.hot.addStatusHandler((status) => {
				if (status === "abort") {
					setTimeout(() => process.exit(0), 0);
				}
			});
		}
	}
}
catch (error) {
	console.error(error.stack || error);

	throw error;
}
