const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');


// default options
app.use(fileUpload());


// router
//     .route('/upload')
//     .put((req, res) => {
app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado un archivo' } })
    }
    // validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos ' + tiposValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // console.log(extension);

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }
    // cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`)
        // .then(() => { res.json({ ok: true, message: 'Imagen subida correctamente' }) })
        .then(() => {
            // La imagen ya cargo
            if (tipo == 'usuarios') imagenUsuario(id, res, nombreArchivo)
            else imagenProducto(id, res, nombreArchivo);

        })
        .catch((err) => { return res.status(500).json({ ok: false, err }) });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id)
        .then(usuarioDB => {
            if (!usuarioDB) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({ ok: false, err: { message: 'El usuario no existe' } });
            }

            borraArchivo(usuarioDB.img, 'usuarios');


            usuarioDB.img = nombreArchivo;
            usuarioDB.save().then(usuarioGuardado => {
                res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivo })
            })
        })
        .catch((err) => {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({ ok: false, err })
        });

}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id)
        .then(productoDB => {
            if (!productoDB) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(400).json({ ok: false, err: { message: 'El producto no existe' } });
            }

            borraArchivo(productoDB.img, 'productos');

            productoDB.img = nombreArchivo;
            productoDB.save().then(productoGuardado => {
                res.json({ ok: true, producto: productoGuardado, img: nombreArchivo })
            })
        })
        .catch((err) => {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({ ok: false, err })
        });
}



function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;