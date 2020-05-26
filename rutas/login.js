var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario,',
                errors: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        usuarioBD.password = ":)";
        // Crear un token
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            mensaje: 'login 200!',
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id,
            body: body,
        });
    })
})

module.exports = app;