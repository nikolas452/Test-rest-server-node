const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const genToken = require('../middlewares/createToken');


const Usuario = require('../models/usuarios');

router
    .route('/login')
    .post((req, res) => {
        let body = req.body;
        Usuario.findOne({ email: body.email })
            .then(usuarioDB => {
                if (!usuarioDB) { return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos' } }); }
                if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                    return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrectos' } });
                }
                // let token = genToken(usuarioDB);
                let token = jwt.sign({ usuarioDB }, 'este-es-el-sid-desarrollo', { expiresIn: 60 * 60 * 24 * 30 });
                res.json({ ok: true, usuario: usuarioDB, token });

            })
            .catch(err => {
                res.status(500).json({ ok: false, err });
                console.log(err);
            });


    })



router
    .route('/google')
    .post((req, res) => {

    })



module.exports = router;