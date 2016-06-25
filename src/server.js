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

				// TODO Fix CSS IMPORT
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
									/*

									Colorbrewer theme
									Original: https://github.com/mbostock/colorbrewer-theme (c) Mike Bostock <mike@ocks.org>
									Ported by Fabrício Tavares de Oliveira

									*/

									.hljs {
										display: block;
										overflow-x: auto;
										padding: 0.5em;
										-webkit-text-size-adjust: none;
									}

									.hljs,
									.hljs-subst,
									.hljs-tag .hljs-title,
									.nginx .hljs-title {
										color: #000;
									}

									.hljs-string,
									.hljs-title,
									.hljs-constant,
									.hljs-parent,
									.hljs-tag .hljs-value,
									.hljs-rule .hljs-value,
									.hljs-preprocessor,
									.hljs-pragma,
									.haml .hljs-symbol,
									.ruby .hljs-symbol,
									.ruby .hljs-symbol .hljs-string,
									.hljs-template_tag,
									.django .hljs-variable,
									.smalltalk .hljs-class,
									.hljs-addition,
									.hljs-flow,
									.hljs-stream,
									.bash .hljs-variable,
									.apache .hljs-tag,
									.apache .hljs-cbracket,
									.tex .hljs-command,
									.tex .hljs-special,
									.erlang_repl .hljs-function_or_atom,
									.asciidoc .hljs-header,
									.markdown .hljs-header,
									.coffeescript .hljs-attribute,
									.hljs-name {
										color: #756bb1;
									}

									.smartquote,
									.hljs-comment,
									.hljs-annotation,
									.diff .hljs-header,
									.hljs-chunk,
									.asciidoc .hljs-blockquote,
									.markdown .hljs-blockquote {
										color: #636363;
									}

									.hljs-number,
									.hljs-date,
									.hljs-regexp,
									.hljs-literal,
									.hljs-hexcolor,
									.smalltalk .hljs-symbol,
									.smalltalk .hljs-char,
									.go .hljs-constant,
									.hljs-change,
									.lasso .hljs-variable,
									.makefile .hljs-variable,
									.asciidoc .hljs-bullet,
									.markdown .hljs-bullet,
									.asciidoc .hljs-link_url,
									.markdown .hljs-link_url {
										color: #31a354;
									}

									.hljs-label,
									.ruby .hljs-string,
									.hljs-decorator,
									.hljs-filter .hljs-argument,
									.hljs-localvars,
									.hljs-array,
									.hljs-attr_selector,
									.hljs-important,
									.hljs-pseudo,
									.hljs-pi,
									.haml .hljs-bullet,
									.hljs-doctype,
									.hljs-deletion,
									.hljs-envvar,
									.hljs-shebang,
									.apache .hljs-sqbracket,
									.nginx .hljs-built_in,
									.hljs-list .hljs-built_in,
									.tex .hljs-formula,
									.erlang_repl .hljs-reserved,
									.hljs-prompt,
									.asciidoc .hljs-link_label,
									.markdown .hljs-link_label,
									.vhdl .hljs-attribute,
									.clojure .hljs-attribute,
									.asciidoc .hljs-attribute,
									.lasso .hljs-attribute,
									.coffeescript .hljs-property,
									.hljs-phony {
										color: #88f;
									}



									.hljs-keyword,
									.hljs-id,
									.hljs-title,
									.hljs-built_in,
									.css .hljs-tag,
									.hljs-doctag,
									.smalltalk .hljs-class,
									.hljs-winutils,
									.bash .hljs-variable,
									.apache .hljs-tag,
									.hljs-type,
									.hljs-typename,
									.tex .hljs-command,
									.asciidoc .hljs-strong,
									.markdown .hljs-strong,
									.hljs-request,
									.hljs-status {
										color: #3182bd;
									}

									.asciidoc .hljs-emphasis,
									.markdown .hljs-emphasis {
										font-style: italic;
									}

									.nginx .hljs-built_in {
										font-weight: normal;
									}

									.coffeescript .javascript,
									.javascript .xml,
									.lasso .markup,
									.tex .hljs-formula,
									.xml .javascript,
									.xml .vbscript,
									.xml .css,
									.xml .hljs-cdata {
										opacity: 0.5;
									}

									.css .hljs-attribute,
									.html .hljs-attribute {
										color: #e6550d;
									}

									.css .hljs-class,
									.html .hljs-tag,
									.html .hljs-title {
										color: #3182bd;
									}

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
