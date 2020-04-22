const jwt = require('jsonwebtoken');

// =====================
// Verificar Token
// =====================
let verificarToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(400).json({ ok: false, err });

        req.usuario = decoded.usuario;
        next();
    });
}

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else return res.json({ ok: false, err: { message: 'El usuario no es administrador' } });
}

// =====================
// Generar Token
// =====================
let genToken = (usuarioRecibido) => {
    let token = jwt.sign({ usuario: usuarioRecibido }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
    return token;
}



module.exports = { verificarToken, verificaAdmin_Role, genToken };