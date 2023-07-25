const express = require('express');
const conectarBancoDados = require('../middlewares/conectarBD');
const router = express.Router();

/* GET users listing. */
router.get('/', conectarBancoDados, function(req, res, next) {
  res.send(`${process.env.TESTE}`);
});

module.exports = router;
