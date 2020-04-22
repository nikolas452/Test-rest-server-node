const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const { genToken } = require('../middlewares/autenticacion');


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
                let token = genToken(usuarioDB);
                res.json({ ok: true, usuario: usuarioDB, token });

            })
            .catch(err => { res.status(500).json({ ok: false, err }) });


    })



//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

router
    .route('/google')
    .post(async(req, res) => {

        let token = req.body.idtoken;
        let googleUser = await verify(token)
            .catch(e => { return res.status(403).json({ ok: false, err: e }) });

        Usuario.findOne({ email: googleUser.email })
            .then(usuarioDB => {
                if (usuarioDB) {
                    if (usuarioDB.google === false) {
                        return res.status(400).json({ ok: false, err: { message: 'Debe usar su autenticacion normal' } });
                    } else {
                        let token = genToken(usuarioDB);
                        res.json({ ok: true, usuario: usuarioDB, token });

                    }

                } else {
                    // si el usuario no existe en nuestra base de datos
                    let usuario = new Usuario();
                    usuario.nombre = googleUser.nombre;
                    usuario.email = googleUser.email;
                    usuario.img = googleUser.img;
                    usuario.password = ':)';
                    usuario.save()
                        .then(usuarioDB => {
                            let token = genToken(usuarioDB);
                            res.json({ ok: true, usuario: usuarioDB, token })
                        })
                        .catch(err => { return res.status(500).json({ ok: false, err }) });

                }
            })
            .catch(err => { return res.status(500).json({ ok: false, err }) });


    });

module.exports = router;