const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');


router
    .route('/productos')

.get(verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec()
        .then(productos => { return res.json({ ok: true, productos }) })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})

.post(verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save()
        .then(productoDB => { return res.status(201).json({ ok: true, producto: productoDB }) })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})

router
    .route('/productos/:id')

.get(verificarToken, (req, res) => {
        let id = req.params.id;
        Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec()
            .then(productoDB => {
                if (!productoDB) return res.status(400).json({ ok: false, err: { message: 'El ID no existe' } })
                return res.json({ ok: true, productoDB })
            })
            .catch(err => { return res.status(500).json({ ok: false, err }) });
    })
    .post((req, res) => {

    })
    .put(verificarToken, (req, res) => {
        let id = req.params.id;
        let body = req.body;

        Producto.findById(id)
            .then(productoDB => {
                if (!productoDB) return res.status(400).json({ ok: false, err: { message: 'El ID no existe' } })
                productoDB.nombre = body.nombre;
                productoDB.precioUni = body.precioUni;
                productoDB.categoria = body.categoria;
                productoDB.disponible = body.disponible;
                productoDB.descripcion = body.descripcion;
                productoDB.save()
                    .then(productoGuardado => { return res.json({ ok: true, producto: productoGuardado }) })
                    .catch(err => { return res.status(500).json({ ok: false, err }) });
            })
            .catch(err => { return res.status(500).json({ ok: false, err }) });

    })

.delete(verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .then(productoDB => {
            if (!productoDB) return res.status(400).json({ ok: false, err: { message: 'El ID no existe' } });
            productoDB.disponible = false;
            productoDB.save()
                .then(productoGuardado => { return res.json({ ok: true, producto: productoGuardado, message: 'Producto borrado' }) })
                .catch(err => { return res.status(500).json({ ok: false, err }) });


        })
        .catch(err => { return res.status(500).json({ ok: false, err }) });
})

router
    .route('/productos/buscar/:termino')
    .get(verificarToken, (req, res) => {

        let termino = req.params.termino;
        let regexp = new RegExp(termino, 'i');


        Producto.find({ disponible: true, nombre: regexp })
            .populate('categoria', 'nombre')
            .exec()
            .then(productoDB => { return res.json({ ok: true, producto: productoDB }) })
            .catch(err => { return res.status(500).json({ ok: false, err }) });

    })


module.exports = router;