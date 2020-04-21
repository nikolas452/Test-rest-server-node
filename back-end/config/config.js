// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 4000;


// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
// Vencimiento del token
// ========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================
// SEED de autenticacion
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-sid-desarrollo';



// ========================================
// Base de datos
// ========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Test';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ========================================
// Google Client ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '612323489965-dr2be1a100p75el3a57qiuqn0dl596su.apps.googleusercontent.com';