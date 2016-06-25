import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

/**
 * Main React application entry-point for both the server and client.
 */
export default class Doc extends React.Component {
  render() {
    return (
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={250} transitionLeaveTimeout={150} transitionAppearTimeout={150} transitionAppear={true}>
        <div>
          <h1>{this.props.routeParams.endpoint || "Home"}</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Donec a facilisis purus, nec dapibus purus.Maecenas tincidunt volutpat lectus, at sodales nisi eleifend eu.Nullam maximus non turpis in suscipit.Phasellus ac velit facilisis, suscipit odio quis, rutrum tellus.Fusce suscipit orci eu cursus commodo.Vivamus eget nunc et nisi scelerisque tempor.In eu eleifend justo.Pellentesque fringilla elementum lorem, non aliquet arcu accumsan non.Nulla facilisi.Duis suscipit pretium metus, vel eleifend massa consectetur accumsan.Nulla nec bibendum lectus, a aliquet odio.Aliquam ipsum neque, interdum eget convallis sed, lobortis et sem.Nulla nec mauris eu augue blandit elementum.In malesuada at magna a ullamcorper.Nullam pretium in dui vitae faucibus.Donec euismod lectus nulla, at iaculis ante commodo nec.
          </p>

          <p>Fusce vel porta nulla.Proin a magna erat.Nulla tortor tellus, scelerisque ac enim a, varius luctus lacus.Sed pellentesque, ipsum vel imperdiet tempor, nisl nunc pulvinar odio, quis interdum ante risus a quam.Cras tristique libero purus, id fringilla enim venenatis et.Phasellus nec ex ut arcu interdum luctus.Proin id quam id turpis vehicula mollis et a est.Nam lacus felis, ultricies id sem eget, rhoncus aliquet massa.</p>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}