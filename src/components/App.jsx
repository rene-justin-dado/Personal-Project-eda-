import React from 'react'
import request from 'superagent'

import VideoChat from './VideoChat'

// import videoChat from videoChatComponent
// import poetryCorner from poetryCornerComponent
//  Thesaurus
//  Dictionary
//  Rhymes
// import tactComms from tactCommsComponent

export default React.createClass ({
  render () {
    return (
      <div id="appContainer">
        <div id="poetryCorner">stuff</div>
        <VideoChat />
        <div id="tactComms">things</div>
      </div>
    )
  }
})
