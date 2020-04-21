const mongoose = require('mongoose');


// const url = process.env.URLDB;
const url = 'mongodb://localhost:27017/Test';
mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => console.log('Bases de datos ONLINE'))
    .catch(e => { throw e });