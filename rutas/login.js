var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
var mdAutenticacion = require('../middelware/autenticacion');


//Rntxm1ucYZKUbpkP
//frank
var Usuario = require('../models/usuario');
//GOOGLE
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        // payload
    }
}

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 })

    res.status(200).json({
        ok: 200,
        token: token
    })
})

// ==================================
// AUTENTICACION GOOGLE
// ==================================
app.post('/google', async (req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                mensaje: 'token no valido',
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario,',
                errors: err
            });
        }
        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'debe usar su autenticacion normal,',
                });
            } else {
                generarTokenOK(usuarioBD, res);
            }
        } else {
            // el usuario no existe... hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al crear usuario proveniente de google,',
                        errors: err
                    });
                }
                generarTokenOK(usuarioBD, res);
            })
        }

    });
})


// ==================================
// AUTENTICACION NORMAL
// ==================================
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
        generarTokenOK(usuarioBD, res);
    })
})

//crea el token y responde con estado 200
function generarTokenOK(usuarioBD, res) {
    // Crear un token

    var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 })
    res.status(200).json({
        ok: true,
        mensaje: 'login 200!',
        usuario: usuarioBD,
        token: token,
        id: usuarioBD._id,
        menu: obtenerMenu(usuarioBD.role)
    });

}

function obtenerMenu(ROLE) {
    var menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/' },
                { titulo: 'ProgressBar', url: 'progress' },
                { titulo: 'Gráficas', url: 'graficas1' },
                { titulo: 'Promesas', url: 'promesas' },
                { titulo: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: 'hospitales' },
                { titulo: 'Medicos', url: 'medicos' },
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        //unshift anade al arreglo al inicio, push al final
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}

module.exports = app;