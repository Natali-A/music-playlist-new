
// export object
module.exports = {

  // TODO:
  // add any helper

  sendError: function(err, req, res) {
    res.status(500).send({error: err});
  }

};