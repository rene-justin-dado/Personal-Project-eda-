'use strict';

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia

// import {} from './handleIceCandidates'

// DOM interactions
const startbutton = document.getElementById('startbutton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')
callButton.disabled = true
hangupButton.disabled = true
startButton.onclick = start()
callButton.onclick = call
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
// Add localPC to global scope so it's accessible from the browser console
window.localPC = localPC = new RTCPeerConnection(servers)
console.log('Created local peer connection object localPC (available in global scope)')
localPC.onicecandidate = (err) => { onIceCandidate(localPC, err) }

// Add remotePC to global scope so it's accessible from the browser console
window.remotePC = remotePC = new RTCPeerConnection(servers)
console.log('Created remote peer connection object remotePC (available in global scope)')
remotePC.onicecandidate = (err) => { onIceCandidate(remotePC, err) }


function start () {
  navigator.mediaDevices.getUserMedia({
    audio:false,
    video: true
  })
  .then(gotStream)
  .catch(err => console.error(err.name))
}

function gotStream (stream) {
  if (window.URL) {
    localVideo.src = window.URL.createObjectURL(stream)
    localVideo.srcObject = stream
  } else {
    localVideo.src = stream
  }
  console.log('Received local stream (this is the result of the success callback of getUserMedia)')
  // Add localStream to global scope so it's accessible from the browser console
  window.localStream = localStream = stream
  callButton.disabled = false
}

function gotRemoteStream(evt) {
  // Add remoteStream to global scope so it's accessible from the browser console
  window.remoteStream = remoteVideo.srcObject = evt.stream;
  console.log('pc2 received remote stream');
}

function call() {
  callButton.disabled = true
  hangupButton.disabled = false
  console.log('Starting call')
  startTime = window.performance.now()
  var videoTracks = localStream.getVideoTracks()
  var audioTracks = localStream.getAudioTracks()
  if (videoTracks.length > 0) {
    console.log('Using video device: ' + videoTracks[0].label)
  }
  if (audioTracks.length > 0) {
    console.log('Using audio device: ' + audioTracks[0].label)
  }

  /////////////////////////////////////////////
  localPC.oniceconnectionstatechange = function(e) {
    onIceStateChange(localPC, e)
  }
  remotePC.oniceconnectionstatechange = function(e) {
    onIceStateChange(remotePC, e)
  }
  remotePC.onaddstream = gotRemoteStream

 localPC.addTrack(localStream)
 console.log('Added local stream to localPC')

  console.log('localPC createOffer start')
  localPC.createOffer(
    offerOptions
  ).then(
    onCreateOfferSuccess,
    onCreateSessionDescriptionError
  )
}

//
//
//
// function onCreateSessionDescriptionError(error) {
//   trace('Failed to create session description: ' + error.toString())
// }
//
// function onCreateOfferSuccess(desc) {
//   trace('Offer from localPC\n' + desc.sdp)
//   trace('localPC setLocalDescription start')
//   localPC.setLocalDescription(desc).then(
//     function() {
//       onSetLocalSuccess(localPC);
//     },
//     onSetSessionDescriptionError
//   );
//   trace('remotePC setRemoteDescription start');
//   remotePC.setRemoteDescription(desc).then(
//     function() {
//       onSetRemoteSuccess(remotePC);
//     },
//     onSetSessionDescriptionError
//   );
//   trace('remotePC createAnswer start');
//   // Since the 'remote' side has no media stream we need
//   // to pass in the right constraints in order for it to
//   // accept the incoming offer of audio and video.
//   remotePC.createAnswer().then(
//     onCreateAnswerSuccess,
//     onCreateSessionDescriptionError
//   );
// }
//
// function onSetLocalSuccess(pc) {
//   trace(getName(pc) + ' setLocalDescription complete');
// }
//
// function onSetRemoteSuccess(pc) {
//   trace(getName(pc) + ' setRemoteDescription complete');
// }
//
// function onSetSessionDescriptionError(error) {
//   trace('Failed to set session description: ' + error.toString());
// }
//
// function gotRemoteStream(e) {
//   // Add remoteStream to global scope so it's accessible from the browser console
//   window.remoteStream = remoteVideo.srcObject = e.stream;
//   trace('remotePC received remote stream');
// }
//
// function onCreateAnswerSuccess(desc) {
//   trace('Answer from remotePC:\n' + desc.sdp);
//   trace('remotePC setLocalDescription start');
//   remotePC.setLocalDescription(desc).then(
//     function() {
//       onSetLocalSuccess(remotePC);
//     },
//     onSetSessionDescriptionError
//   );
//   trace('localPC setRemoteDescription start');
//   localPC.setRemoteDescription(desc).then(
//     function() {
//       onSetRemoteSuccess(localPC);
//     },
//     onSetSessionDescriptionError
//   );
// }
//
// /////////////////////////////////////////////
//
// function onAddIceCandidateSuccess(pc) {
//   trace(getName(pc) + ' addIceCandidate success');
// }
//
// function onAddIceCandidateError(pc, error) {
//   trace(getName(pc) + ' failed to add ICE Candidate: ' + error.toString());
// }
//
// function onIceStateChange(pc, event) {
//   if (pc) {
//     trace(getName(pc) + ' ICE state: ' + pc.iceConnectionState);
//     console.log('ICE state change event: ', event);
//   }
// }
// /////////////////////////////////////////////
//
//
// function hangup() {
//   trace('Ending call');
//   localPC.close();
//   remotePC.close();
//   localPC = null;
//   remotePC = null;
//   hangupButton.disabled = true;
//   callButton.disabled = false;
// }
