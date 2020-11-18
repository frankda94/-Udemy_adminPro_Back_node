var jwt = require('jsonwebtoken');
const { response } = require('express');
const Usuario = require('../models/usuario')

// ==================================
// Verificar token
// ==================================
const validarToken = (req, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            mensaje: "no autorizado"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //ver el ID de quien hace la peticion
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: "no autorizado token no valido"
        })
    }
}


// ==================================
// Verifica ADMIN o mismo USUARIO
// ==================================
const verificaADMIN_o_MismoUsuario = async (req, res, next) => {

      const uid = req.uid;
      const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msj: 'usuario no encontrado'
            })
        }
        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        } else{
            return res.status(403).json({
                ok: false,
                msj: 'no tiene privilegios para hacer eso'
            })
        }

    } catch (error) {
        res.status(500).json ({
            ok: false,
            msj: 'error al validar ADMIN_ROLE '
        })
    }
}

const varlidarADMIN_ROLE = async (req, res, next) => {

    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msj: 'usuario no encontrado'
            })
        }
        if (usuarioDB.role != 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msj: 'no tiene privilegios para hacer eso'
            })
        }
        next();

    } catch (error) {
        res.status(500).json ({
            ok: false,
            msj: 'error al validar ADMIN_ROLE '
        })
    }
}

module.exports = {
    validarToken,
    varlidarADMIN_ROLE,
    verificaADMIN_o_MismoUsuario
}