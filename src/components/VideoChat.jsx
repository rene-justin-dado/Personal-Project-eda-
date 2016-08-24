import React from 'react' 

export default React.createClass({
  render() {
    return (
      <div id="videoChat">
        <h1>Realtime communication with WebRTC</h1>
        <video id="localVideo" autoPlay>local</video>
        <video id="remoteVideo" autoPlay>remote</video>

        <div id="videoControls">
          <button id="startButton">Start</button>
          <button id="callButton">Call</button>
          <button id="hangupButton">Hang Up</button>
        </div>
      </div>
    )
  }
})
