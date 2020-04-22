const express = require('express');
const router = express.Router();

const Usuario = require('../models/usuarios');

const _ = require('underscore');
const bcrypt = require('bcrypt');

const { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

router
    .route('/usuario')
    .post([verificarToken, verificaAdmin_Role], (req, res) => {
        let { nombre, email, password, role } = req.body;
        let user = new Usuario({ nombre, email, password: bcrypt.hashSync(password, 10), role });

        user.save()
            .then(usuarioDB => { res.json({ ok: true, usuario: usuarioDB }) })
            .catch(err => { return res.status(400).json({ ok: false, err }) });

        return res.json({ ok: true, message: 'User saved' });
    })
    .get(verificarToken, (req, res) => {
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec()
            .then(losUsuarios => {
                Usuario.count({ estado: true }).then(cuantos => { res.json({ ok: true, losUsuarios, cuantos: cuantos }) })
            })
            .catch(err => { return res.status(400).json({ ok: false, err }) });

    })

router
    .route('/usuario/:id')
    .put([verificarToken, verificaAdmin_Role], (req, res) => {
        let id = req.params.id;
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true })
            .then(usuarioDB => { res.json({ ok: true, usuario: usuarioDB }) })
            .catch(err => { return res.status(400).json({ ok: false, err }) });
    })

.get((req, res) => {
    let id = req.params.id;
    Usuario.findById(id)
        .then(usuarioDB => { return res.json({ ok: true, usuario: usuarioDB }) })
        .catch(err => { return res.status(400).json({ ok: false, err }) });
})

.delete([verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true })
        .then(usuarioDB => { res.json({ ok: true, usuario: usuarioDB }) })
        .catch(err => { return res.status(400).json({ ok: false, err }) });
})

// ----------------------------------------------------------------------------
module.exports = router;