import React, { Component } from "react";
import Scanner from "./Scanner";
import { Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";

class Camera extends Component {
  constructor() {
    super();
    this.state = {
      scanning: false,
      results: [
        // {
        //   codeResult: {
        //     code: '123ABCabc'
        //   }
        // }
      ]
    };
  }

  _renderScanButtonAndResults() {
    if (this.state.scanning) {
      return null;
    }
    return (
      <div
        style={{
          width: "100%",
          height: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {this._renderResults()}
        {this._renderScanButton()}
      </div>
    );
  }

  _renderScanButton() {
    const text = this.state.scanning ? "STOP" : "SCAN";
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={this._scan.bind(this)}
          style={{ marginBottom: "20px" }}
          variant='primary'
        >
          {text}
        </Button>
      </div>
    );
  }

  _renderResults() {
    const result = this.state.results[this.state.results.length - 1];
    if (!result) {
      return null;
    }
    return (
      <div style={{}}>
        <Redirect to={`/student/${result.codeResult.code}`} />
      </div>
    );
    // {/* <ul className="results">
    //   {this.state.results.map((result) => (<Result key={result.codeResult.code} result={result} />))}
    // </ul> */}
  }

  _renderVideoStream() {
    return (
      <div style={{ textAlign: "center" }}>
        {this._renderScanButton()}
        <Scanner onDetected={this._onDetected.bind(this)} />
      </div>
    );
  }

  render() {
    window.addEventListener("beforeunload", function() {
      this.setState({ scanning: false });
    });

    return this._renderScanButtonAndResults() || this._renderVideoStream();
  }

  _scan() {
    this.setState({ scanning: !this.state.scanning });
  }

  _onDetected(result) {
    this.setState({
      results: this.state.results.concat([result]),
      scanning: false
    });
  }
}

export default Camera;
