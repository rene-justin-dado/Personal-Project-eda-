var express = require('express')
var hbs = require('express-handlebars')
var path = require('path')

var index = require('../js/main.js')
var PORT = 3000

var app = express()
app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.listen(PORT, () => {
  console.log('Listening on...'), PORT
})
