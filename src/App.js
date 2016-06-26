import React from "react";
import styles from "./styles/main.scss";
import Doc from "./components/Doc";
import Nav from "./components/Nav";

export default class App extends React.Component {

  render() {
    return (
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
    );
  }
}