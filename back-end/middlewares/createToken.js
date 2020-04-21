const jwt = require('jsonwebtoken');


const genToken = (usuario) => {
    let token = jwt.sign({ usuario }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
    return token;
}


module.exports = genToken;