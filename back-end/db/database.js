const mongoose = require('mongoose');


mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }).then(() => console.log('Bases de datos ONLINE'))
    .catch(e => { throw e });