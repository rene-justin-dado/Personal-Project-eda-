'use strict'
// socket-io-p2p
// const io = require('socket.io')(server)
// const p2p = require('socket.io-p2p-server').Server
// io.use(p2p)

const os = require('os')
const nodeStatic = require('node-static')
const socketIO = require('socket.io')
const PORT = process.env.port || 1337

const fileServer = new(nodeStatic.Server)()
const http = require('http')
const app = http.createServer((req, res) => {
  fileServer.serve(req, res)
}).listen(PORT)

const io = require('socket.io')(app)


io.on('connection', socket => {
  // convenience function to log server messages on the client
  function log() {
    let array = ['Message from server:']
    array.push.apply(array, arguments)
    socket.emit('log', array)
  }
  log(socket)
  socket.on('message', message => socket.broadcast.emit('message', message))
  // socket.on('create or join', room => {
  //   log('Received request to create or join room ' + room)
  //
  //   let numClients = io.sockets.sockets.length
  //   log('Room ' + room + ' now has ' + numClients + ' client(s)')
  //
  //   if (numClients === 1) {
  //     socket.join(room)
  //     log('Client ID ' + socket.id + ' created room ' + room)
  //     socket.emit('created', room, socket.id)
  //
  //   } else if (numClients <= 12) {
  //     log('Client ID ' + socket.id + ' joined room ' + room)
  //     io.sockets.in(room).emit('join', room)
  //     socket.join(room)
  //     socket.emit('joined', room, socket.id)
  //     io.sockets.in(room).emit('ready')
  //   } else { // max two clients
  //     socket.emit('full', room)
  //   }
  // })
  //
  // socket.on('ipaddr', () => {
  //   const ifaces = os.networkInterfaces()
  //   for (var dev in ifaces) {
  //     ifaces[dev].forEach(function(details) {
  //       if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
  //         socket.emit('ipaddr', details.address)
  //       }
  //     })
  //   }
  // })

})
