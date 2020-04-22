require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Rendeizo el index.html
app.use(express.static(path.resolve(__dirname, './public')));

//Rutas
app.use(require('./routes/all-routes'));


// Conexion Mongo
require('./db/database');






app.listen(process.env.PORT, () => {
    console.log(`Server online en puerto ${process.env.PORT}`);
});