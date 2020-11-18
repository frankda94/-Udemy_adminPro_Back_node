var moongose = require('mongoose');

const dbConnection = async () => {
    try {
        await moongose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log(dbConnection);

    } catch (error) {
        throw new Error('error a la hora de iniciar la BD');
    }
}

module.exports = {
    dbConnection: dbConnection
}