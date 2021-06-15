import React, { Component } from "react";
import Quagga from "quagga";

class Scanner extends Component {
  render() {
    return (
      <div
        id='interactive'
        className='viewport'
        style={{ width: "90%", overflow: "hidden" }}
      >
        <video
          className='videoCamera'
          autoPlay={true}
          preload='auto'
          src=''
          muted={true}
          playsInline={true}
          style={{
            width: "100%",
            height: "100%"
          }}
        ></video>
        {/* <canvas
          className='drawingBuffer'
          style={{
            position: "absolute",
            top: 0,
            left: 0
          }}
        ></canvas> */}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("beforeunload", Quagga.stop);

    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      // safely access `navigator.mediaDevices.getUserMedia`
    }
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          constraints: {
            width: window.innerWidth,
            height: window.innerHeight,
            facingMode: "environment" // or user
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 0,
        decoder: {
          readers: ["code_39_reader"]
        },
        locate: true
      },
      function(err) {
        Quagga.start();
      }
    );
    Quagga.onDetected(this._onDetected.bind(this));
    // Quagga.onProcessed(function(result) {
    //   const drawingCtx = Quagga.canvas.ctx.overlay;
    //   const drawingCanvas = Quagga.canvas.dom.overlay;
    //   if (result) {
    //     if (result.boxes) {
    //       drawingCtx.clearRect(
    //         0,
    //         0,
    //         parseInt(drawingCanvas.getAttribute("width")),
    //         parseInt(drawingCanvas.getAttribute("height"))
    //       );
    //       result.boxes
    //         .filter(box => box !== result.box)
    //         .forEach(box => {
    //           Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
    //             color: "green",
    //             lineWidth: 2
    //           });
    //         });
    //     }
    //     if (result.box) {
    //       Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
    //         color: "#00F",
    //         lineWidth: 2
    //       });
    //     }
    //     if (result.codeResult && result.codeResult.code) {
    //       Quagga.ImageDebug.drawPath(
    //         result.line,
    //         { x: "x", y: "y" },
    //         drawingCtx,
    //         { color: "red", lineWidth: 3 }
    //       );
    //     }
    //   }
    // });
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected.bind(this));
    Quagga.stop();
    window.removeEventListener("beforeunload", this.componentCleanup); // remove the event handler for normal unmounting
  }

  _onDetected(result) {
    this.props.onDetected(result);
  }
}

export default Scanner;
