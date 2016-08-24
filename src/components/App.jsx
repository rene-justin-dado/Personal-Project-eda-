import React from 'react'

import VideoChat from './VideoChat'
import PoetryCorner from './PoetryCorner'
// import videoChat from videoChatComponent
// import poetryCorner from poetryCornerComponent
//  Thesaurus
//  Dictionary
//  Rhymes
// import tactComms from tactCommsComponent


export default React.createClass ({
  getInitialState () {
    return { words: []}
  },

  render () {
    const wordElements = this.state.words.map((elem, i) => {
      return <words noun={elem.noun} verb={elem.verb} key={i}/>
    })

    return (
      <div id="appContainer">
        <PoetryCorner words={this.state.words}/>
        {wordElements}
        <VideoChat />
        <img src="http://s59.podbean.com/pb/ee07cb7e24d553b98aaa568bfde326b4/57bd5652/data1/blogs60/713853/uploads/fistbump.png" alt="fist bump"/>
      </div>
    )
  }
})
