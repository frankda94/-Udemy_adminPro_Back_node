var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middelware/autenticacion');

var Usuario = require('../models/usuario');

//==================================
//Obtener todos los usuarios
//==================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar usuarios,',
                        errors: err
                    });
                }
                Usuario.countDocuments({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'get de usuarios 200!',
                        usuarios: usuarios,
                        total: count,
                        restantes: count - desde > 0
                    });
                });
            });
});


//==================================
//Crear un nuevo usuario
//==================================
app.post('/', (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario,
            mensaje: "usuario guardado ok!"
        });
    });
});


//==================================
//Actualizar un nuevo usuario
//==================================
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id' + id + 'no existe',
                errors: err
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar usuario',
                    errors: err
                });
            }
            usuarioActualizado.password = ':)';
            res.status(201).json({
                ok: true,
                usuario: usuarioActualizado,
                mensaje: "usuario actualizado ok!"
            });
        });
    });
});
// ==================================
// Borrar usuario por ID
// ==================================
app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al eliminar usuario',
                errors: err
            });
        }
        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id' + id + 'no existe',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado,
            mensaje: "usuario eliminado  ok!"
        });
    })

});

module.exports = app;