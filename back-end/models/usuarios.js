const { Schema, mongoose, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
const Usuario = new Schema({
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
    img: { type: String, required: false },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La password de requerida'] }

});
Usuario.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

Usuario.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = model('Usuario', Usuario);