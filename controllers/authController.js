const { response } = require('express');
const Usuario = require('../models/usuario');
var bcryptjs = require('bcryptjs');
const { generarTokenOK } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/googleVerificador');
const usuario = require('../models/usuario');
const { getMenuFront } = require('../helpers/menu-frontend');

// ==================================
// autenticacion NORMALL
// ==================================
const login = async (req, res = response) => {

    const { email, password } = req.body;
    // const eje = req.query.eje;
    //cuerpo es con  req.body
    //query params es con req.query
    //cabecera es con req.header
    // console.log(email, " " + eje)

    try {
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                mensaje: "email no valido"
            })
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            res.status(404).json({
                ok: false,
                mensaje: "password no valida"
            })
        }

        //generar el JWT
        const jwt = await generarTokenOK(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token: jwt,
            menu: getMenuFront(usuarioDB.role)
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "error inesperado en el logueo"
        })
    }
}

// ==================================
// autenticacion GOOGLE
// ==================================
const googleSignIn = async (req, res = response) => {

    const googleToken = req.header('g-token');

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                img: picture,
                password: ':)',
                google: true
            })
        } else {
            // existe el usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        await usuario.save();
        const jwt = await generarTokenOK(usuarioDB.id);

        res.status(200).json({
            ok: true,
            name, email, picture,
            token: jwt,
            menu: getMenuFront(usuario.role)
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "token no es correcto"
        })
    }
}

// ==================================
// renovar token
// ==================================
const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarTokenOK(uid);

    const usuarioDB = await Usuario.findById(uid);


    res.json({
        ok: true,
        token,
        usuario: usuarioDB,
        menu: getMenuFront(usuarioDB.role)
    })
}


module.exports = {
    login,
    googleSignIn,
    renewToken,
}