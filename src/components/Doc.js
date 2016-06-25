import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import api from "../swagger";
import jsonFormat from 'json-format';
import Highlight from 'react-highlight';

/**
 * Main React application entry-point for both the server and client.
 */
export default class Doc extends React.Component {
  render() {
    let pathDefinition = api.getPath(this.props.params.endpoint);
    return (
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={250} transitionLeaveTimeout={150} transitionAppearTimeout={150} transitionAppear={true}>
        {api.getFullPath(this.props.params.endpoint) ? <SwaggerDoc path={this.props.params.endpoint} definition={pathDefinition} /> : <NoDoc />}
      </ReactCSSTransitionGroup>
    );
  }
}

class SwaggerDoc extends React.Component {
  render() {
    return (
      <div>
      <h1>{api.getFullPath(this.props.path) || "Home"}</h1>
          <Highlight className='json'>{jsonFormat(this.props.definition, {  type: 'space', size: 2})}</Highlight>
      </div>
    )
  }
}

// Displayed if the route is not known
class NoDoc extends React.Component {

  render() {
    return (
      <h1>Home</h1>
    )
  }

}