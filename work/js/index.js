// Vendor prefixes for compatibility
navigator.getUserMedia = (navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia)
window.addEventListener('DOMContentLoaded', () => {
// Button controls
  // let startButton = document.getElementById('startButton')
  // let callButton = document.getElementById('callButton')
  // let hangupButton = document.getElementById('hangupButton')
  // callButton.disabled = true
  // hangupButton.disabled = true
  // startButton.onclick = start
  // callButton.onclick = call
  // hangupButton.onclick = hangup
  let isStreaming = false

  const myVideo = document.getElementById('localVideo');
  if (navigator.getUserMedia) {
    navigator.getUserMedia (
      {
        video: true,
        audio: true
      },
      (stream) => {
        const url = window.URL || window.webkitURL
        myVideo.src = url ? url.createObjectURL(stream) : stream
        myVideo.play()
          .catch((err) => alert('Failed to stream video'))
      },
      (error) => "Your browser can't handle the constraints"
    )
  } else {
    alert('Sorry, your browser doesn\'t support getUserMedia')
    return
  }
})
