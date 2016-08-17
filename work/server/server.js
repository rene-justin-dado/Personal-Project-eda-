const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')

const index = require('../js/index.js')
const PORT = process.env.port || 3000

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  sendFile('../index.html')
})

io.on('connection', function(socket){
  console.log('a user connected');
})

app.listen(PORT, () => {
  console.log('Listening on...'), PORT
})
