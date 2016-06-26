import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import jsonFormat from 'json-format';
import Highlight from 'react-highlight';
import ReactMarkdown from 'react-markdown';

/**
 * Main React application entry-point for both the server and client.
 */
export default class Doc extends React.Component {
  render() {
    let pathDefinition = this.props.api.getPath(this.props.endpoint);
    return (
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={250} transitionLeaveTimeout={150} transitionAppearTimeout={150} transitionAppear={true}>
        {this.props.api.getFullPath(this.props.endpoint) ? 
          <SwaggerDoc api={this.props.api} path={this.props.endpoint} key={this.props.endpoint} definition={pathDefinition} /> : 
          <NoDoc api={this.props.api} />}
      </ReactCSSTransitionGroup>
    );
  }
}

class SwaggerDoc extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.api.getFullPath(this.props.path) || "Home"}</h1>
         {this.props.definition.getMethods().map(method => <Method api={this.props.api} key={method} path={this.props.path} method={this.props.definition.getMethod(method)} />)}
         <h2>Raw Swagger Definition</h2>
         <Highlight className='json'>{jsonFormat(this.props.definition, {  type: 'space', size: 2})}</Highlight>
      </div>
    )
  }
}

// Displayed if the route is not known
class NoDoc extends React.Component {

  render() {
    return (
      <div>
        <h1>{this.props.api.getTitle()} Documentation</h1>
        <ReactMarkdown source={this.props.api.getDescription()} />
      </div>
    )
  }

}

class Method extends React.Component {
  render() {
    return (
      <div className="method">
        <div className="method-header">
          <h2 style={{ textTransform: 'uppercase'}}>{this.props.method.method}</h2>
          <pre>{this.props.api.getFullUrl(this.props.path)}</pre>
        </div>
        <h3>{this.props.method.getSummary()}</h3>
        <ReactMarkdown source={this.props.method.getDescription()} />
        <h3>Endpoint Information</h3>
        <table>
          <tbody>
          <OptionalRow left="Request formats" data={this.props.method.definition.consumes} />
          <OptionalRow left="Response formats" data={this.props.method.definition.produces} />
          </tbody>
        </table>
        <h3>Parameters</h3>
        <table>
          <tbody>
          {this.props.method.getParameters().map(parameter => {
            return (
              <ParameterRow parameter={parameter} key={parameter.parameter.name} />
            );
          })}
          </tbody>
        </table>
        <h3>Responses</h3>
        <table>
          <tbody>
          {this.props.method.getResponses().map(code => {
            let response = this.props.method.getResponse(code);
            return (
              <ResponseRow response={response} key={code} />
            );
          })}
          </tbody>
        </table>
      </div>
    )
  }
}

class ParameterRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.parameter.parameter.name}</td>
        <td><ReactMarkdown source={this.props.parameter.getDescription()} /></td>
      </tr>
    )
  }
}

class ResponseRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.response.code}</td>
        <td><ReactMarkdown source={this.props.response._.getDescription()} /></td>
      </tr>
    )
  }
}

class OptionalRow extends React.Component {
  render() {
    return (
      this.props.data ? 
      <tr><td>{this.props.left}</td><td>{(this.props.right || this.props.data).join(', ')}</td></tr> :
      <tr><td></td><td></td></tr>
    );
  }
}