const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { verificarImg } = require('../middlewares/autenticacion');

router
    .route('/imagen/:tipo/:img')
    .get(verificarImg, (req, res) => {
        let tipo = req.params.tipo;
        let img = req.params.img;

        let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
        } else {

            let noImagePath = path.resolve(__dirname, '../assets/tauren.jpg');
            res.sendFile(noImagePath);
        }



    })


module.exports = router;