var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(`${process.env.TESTE}`);
});

module.exports = router;
