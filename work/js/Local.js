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
let isStreaming = false,
    myVideo = document.getElementById('localVideo'),
    canvas = document.getElementById('canvas'),
    grey = document.getElementById('grey')
    context = canvas.getContext('2d'),
    w = 650,
    h = 420,
    greyscale = false

myVideo.addEventListener('canplay', (evt) => {
  if(!isStreaming) {
    // videoWidth can be wonky in some browsers
    if(myVideo.videoWidth > 0) {
      h = myVideo.videoHeight / (myVideo.videoWidth / w)
      canvas.setAttribute('width', w)
      canvas.setAttribute('height', h)
      // Reverse canvas image
      context.translate(w, 0)
      context.scale(-1, 1)
      isStreaming = true
    }
  }
}, false)

// Sets up the second video at a lower z-index
myVideo.addEventListener('play', function() {
   // Every 33 milliseconds copy the video image to the canvas
   setInterval(function() {
      if (myVideo.paused || myVideo.ended) return
      context.fillRect(0, 0, w, h)
      context.drawImage(myVideo, 0, 0, w, h)
      if (greyscale) goingGrey()
   }, 33)
}, false)

// Toggle Grayness
// grey.addEventListener('click', () => {greyscale = !greyscale}, false)
//
// const goingGrey = () => {
//   const imageData = context.getImageData(0, 0, w, h)
//   let data = imageData.data
//   for (let i = 0; i < data.length; i += 4) {
//     const bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
//     data[i] = bright
//     data[i + 1] = bright
//    data[i + 2] = bright
//  }
//  context.putImageData(imageData, 0, 0)
// }

// Set Up Local video
//
myVideo = document.getElementById('localVideo')
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
