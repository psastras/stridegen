import React from "react";
import styles from "./styles/main.scss";
import ReactSwagger from "./components/react-swagger";
import JsonRefs from "json-refs";
import api from "./swagger";

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    JsonRefs.resolveRefs(api)
      .then((res) => {
        this.setState({ api: res.resolved })
      }, (err) => {
        console.error(err);
      });
  }

  render() {
    return (
      this.state.api ?
        <ReactSwagger endpoint={ this.props.params.endpoint } api={ this.state.api } /> :
        <div />
    );
  }
}