const express = require('express');
const conectarBancoDados = require('../middlewares/conectarBD');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EsquemaUsuario = require('../models/usuario');
const router = express.Router();

/* GET users listing. */
router.post('/criar', conectarBancoDados, async function (req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let { nome, email, senha } = req.body;
    const numeroVezesHash = 10;
    const senhaHash = await bcrypt.hash(senha, numeroVezesHash);
    const respostaBD = await EsquemaUsuario.create({ nome, email, senha: senhaHash })
    res.status(200).json({
      status: "OK",
      statusMensagem: "Usuário criado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    if (String(error).includes("email_1 dup key")) {
      return tratarErrosEsperados(res, "Error: Já existe uma conta com este email.")
    }
    return tratarErrosEsperados(res, error);
  }
});

router.post('/logar', conectarBancoDados, async function (req, res) {
  try {
    let { email, senha } = req.body;

    let respostaBD = await EsquemaUsuario.findOne({ email }).select('+senha');
    if (respostaBD) {
      let senhaCorreta = await bcrypt.compare(senha, respostaBD.senha);
      if (senhaCorreta) {
        let token = jwt.sign({ id: respostaBD._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.header('x-auth-token', token);
        res.status(200).json({
          status: "OK",
          statusMensagem: "Usuário autenticado!",
          resposta: { "x-auth-token": token }
        })
      } else {
        throw new Error("email ou senha incorretos");
      }
    } else {
      throw new Error("email ou senha incorretos");
    }
  } catch (err) {
    return tratarErrosEsperados(res, err);
  }
})

module.exports = router;
