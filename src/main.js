'use strict'

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia

// import {} from './handleIceCandidates'

// DOM interactions
const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')
callButton.disabled = true
hangupButton.disabled = true
startButton.addEventListener('click', start)
callButton.addEventListener('click', call)
// hangupButton.onclick = hangup

const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

// stun/turn server config
const servers = {
  'iceServers': [
    {url:'stun:stun01.sipphone.com'},
    {url:'stun:stun.ekiga.net'},
    {url:'stun:stun.fwdnet.net'},
    {url:'stun:stun.ideasip.com'},
    {url:'stun:stun.iptel.org'},
    {url:'stun:stun.rixtelecom.se'},
    {url:'stun:stun.schlund.de'},
    {url:'stun:stun.l.google.com:19302'},
    {url:'stun:stun1.l.google.com:19302'},
    {url:'stun:stun2.l.google.com:19302'},
    {url:'stun:stun3.l.google.com:19302'},
    {url:'stun:stun4.l.google.com:19302'},
    {url:'stun:stunserver.org'},
    {url:'stun:stun.softjoys.com'},
    {url:'stun:stun.voiparound.com'},
    {url:'stun:stun.voipbuster.com'},
    {url:'stun:stun.voipstunt.com'},
    {url:'stun:stun.voxgratia.org'},
    {url:'stun:stun.xten.com'},
    {
    	url: 'turn:numb.viagenie.ca',
    	credential: 'muazkh',
    	username: 'webrtc@live.com'
    },
    {
    	url: 'turn:192.158.29.39:3478?transport=udp',
    	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    	username: '28224511:1379330808'
    },
    {
    	url: 'turn:192.158.29.39:3478?transport=tcp',
    	credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    	username: '28224511:1379330808'
    }
  ]
}

let localStream
let localPC
let remotePC
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
}

function getName(pc) {
  return (pc === localPC) ? 'localPC' : 'remotePC'
}

function getOtherPc(pc) {
  return (pc === localPC) ? remotePC : localPC
}

function gotStream (stream) {
  // Add localStream to global scope so it's accessible from the browser console
  window.localStream = localStream = stream
  console.log('Received local stream (this is the result of the success callback of getUserMedia)')

  callButton.disabled = false
  if (window.URL) {
    localVideo.src = window.URL.createObjectURL(stream)
    localVideo.srcObject = stream
  } else {
    localVideo.src = stream
  }
}

function start () {
  startButton.disabled=true
  navigator.mediaDevices.getUserMedia({
    audio:true,
    video: true
  })
  .then(gotStream)
  .catch(err => console.error(err.name))
}

function call() {
  callButton.disabled = true
  hangupButton.disabled = false
  console.log('Starting call')
  const videoTracks = localStream.getVideoTracks()
  const audioTracks = localStream.getAudioTracks()
  if (videoTracks.length > 0) {
    console.log('Using video device: ' + videoTracks[0].label)
  }
  if (audioTracks.length > 0) {
    console.log('Using audio device: ' + audioTracks[0].label)
  }

  // Add localPC to global scope so it's accessible from the browser console
  window.localPC = localPC = new RTCPeerConnection(servers)
  console.log('Created local peer connection object for localPC (available in global scope)')
  localPC.onicecandidate = evt => { onIceCandidate(localPC, evt) }

  // Add remotePC to global scope so it's accessible from the browser console
  window.remotePC = remotePC = new RTCPeerConnection(servers)
  console.log('Created remote peer connection object for remotePC (available in global scope)')
  remotePC.onicecandidate = evt => { onIceCandidate(remotePC, evt) }

  localPC.oniceconnectionstatechange = evt => { onIceStateChange(localPC, evt) }
  remotePC.oniceconnectionstatechange = evt => { onIceStateChange(remotePC, evt) }
  remotePC.onaddstream = gotRemoteStream

 localPC.addStream(localStream)
 console.log('Added local stream to localPC')
  console.log('localPC createOffer start')
  localPC.createOffer(offerOptions)
  .then(
    onCreateOfferSuccess,
    onCreateSessionDescriptionError
  )
}

function onIceCandidate (pc, evt) {
  if (evt.candidate) {
    getOtherPc(pc).addIceCandidate(new RTCIceCandidate(evt.candidate))
    .then(() => onAddIceCandidateSuccess)
    .catch(err => onAddIceCandidateError(pc, err))
  }
}

function onAddIceCandidateSuccess(pc) {
  console.log(`${getName(pc)} addIceCandidate success`)
}

function onAddIceCandidateError(pc, error) {
  console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`)
}

function onCreateSessionDescriptionError(err) {
  console.log(`Failed to create session description: ${err.toString()}`)
}

function onCreateOfferSuccess(desc) {
  console.log(`Offer from localPC\n ${desc.sdp}`)
  console.log('localPC setLocalDescription start')
  localPC.setLocalDescription(desc)
         .then(onSetLocalSuccess(localPC))
         .catch(onSetSessionDescriptionError)

  console.log('remotePC setRemoteDescription start')
  remotePC.setRemoteDescription(desc)
          .then(onSetRemoteSuccess(remotePC))
          .catch(onSetSessionDescriptionError)
  console.log('remotePC createAnswer start')

  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  remotePC.createAnswer()
          .then(onCreateAnswerSuccess)
          .catch(onCreateSessionDescriptionError)
}

function onSetLocalSuccess(pc) {
  console.log(`${getName(pc)} setLocalDescription complete`)
}

function onSetSessionDescriptionError(err) {
  console.log(`Failed to set session description:  ${err.toString()}`)
}
function onSetRemoteSuccess(pc) {
  console.log(`${getName(pc)} setRemoteDescription complete`)
}

function onCreateAnswerSuccess(desc) {
  console.log(`Answer from remotePC:\n`) //${desc.sdp}
  console.log('remotePC setLocalDescription start')
  remotePC.setLocalDescription(desc)
          .then(onSetLocalSuccess(remotePC))
          .catch(onSetSessionDescriptionError)

  console.log('localPC setRemoteDescription start')
  localPC.setRemoteDescription(desc)
         .then(onSetRemoteSuccess(localPC))
         .catch(onSetSessionDescriptionError)
}
////////////////////////////////////////////////////////////////////////////////////////





function gotRemoteStream(e) {
  // Add remoteStream to global scope so it's accessible from the browser console
  window.remoteStream = remoteVideo.srcObject = e.stream
  console.log('remotePC received remote stream')
}

// /////////////////////////////////////////////
//
//
function onIceStateChange(pc, evt) {
  if (pc) {
    console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`)
    console.log('ICE state change event: ', evt)
  }
}
// /////////////////////////////////////////////
//
//
// function hangup() {
//   console.log('Ending call')
//   localPC.close()
//   remotePC.close()
//   localPC = null
//   remotePC = null
//   hangupButton.disabled = true
//   callButton.disabled = false
// }
