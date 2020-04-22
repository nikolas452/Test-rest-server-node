const express = require('express');
const router = express.Router();

const { verificarToken, verificaAdmin_Role, genToken } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');


router
    .route('/categoria')

.get(verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec()
        .then(categoriaDB => { res.json({ ok: true, categoria: categoriaDB }) })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})

.post(verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });
    categoria.save()
        .then(categoriaDB => {
            if (!categoriaDB) return res.status(400).json({ ok: false, err: 'No se pudo guardar' });
            else res.json({ ok: true, categoria: categoriaDB });
        })
        .catch(err => { return res.status(400).json({ ok: false, err }) });
})

router
    .route('/categoria/:id')

.get(verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .then(categoriaDB => {
            if (!categoriaDB) return res.status(400).json({ ok: false, err: 'No se pudo obtener' });
            else res.json({ ok: true, categoria: categoriaDB });
        })
        .catch(err => { return res.status(400).json({ ok: false, err }) });
})

.put(verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = { descripcion: body.descripcion }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true })
        .then(categoriaDB => {
            if (!categoriaDB) return res.status(400).json({ ok: false, err: 'No se pudo guardar' })
            else res.json({ ok: true, categoria: categoriaDB });
        })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})

.delete([verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id)
        .then(categoriaDB => {
            if (!categoriaDB) return res.status(400).json({ ok: false, err: 'El id no existe' })
            else res.json({ ok: true, categoria: categoriaDB, message: 'Categoria borrada con exito' });
        })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})


module.exports = router;