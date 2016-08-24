const superagent = require('superagent')
module.exports = {
  thesaurus: thesaurus
}

function thesaurus () {
request
  .get(`http://words.bighugelabs.com/api/2/99b9e9de9f7b91269a3fd82d037b9068/gorgeous/json`)
  .end((err, res) => {
    if (err) {
      res.send(err)
      return
    }
  })
}
