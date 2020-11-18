const jwt = require('jsonwebtoken')


const generarTokenOK = (uid, res) => {

    return new Promise((resolve, reject) => {
        // Crear un token
        var payload = {
            uid,
        }

        var token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' },
            (err, token) => {

                if (err) {
                    console.log(err)
                    reject("no se pudo generar el jwt");
                } else {
                    resolve(token);
                }
            })
    })


}

module.exports = {
    generarTokenOK
}