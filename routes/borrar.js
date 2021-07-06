var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/transmisor', function(req, res, next) {
  res.render('borrar', { title: 'transmitir' });
});
router.get('/receptor', function(req, res, next) {
  res.render('borrarReceiver', { title: 'Recibir' });
});

module.exports = router;