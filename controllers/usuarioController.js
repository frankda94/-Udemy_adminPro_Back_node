const Usuario = require('../models/usuario');
var bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarTokenOK } = require('../helpers/jwt');


//==================================
//Obtener todos los usuarios
//==================================
const getUsuarios = ('/', async (req, res, next) => {

    var desde = Number(req.query.desde) || 0;

    //EJECUTAR PROMESAS SIMULATANEAS;
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email  img role google')
            .skip(desde)
            .limit(3),

        Usuario.countDocuments()
    ]);

    res.status(200).json({
        ok: true,
        usuarios: usuarios,
        uid: req.uid,
        total,
    });
    // console.log("llamado al api");
    // const usuario = await Usuario.find({}, 'nombre email img role google')
    //     .skip(desde)
    //     .limit(5)
    //     .exec(
    //         (err, usuarios) => {
    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     mensaje: 'error al cargar usuarios,',
    //                     errors: err
    //                 });
    //             }
    //             Usuario.count({}, (err, count) => {
    //                 res.status(200).json({
    //                     ok: true,
    //                     mensaje: 'get de usuarios 200!',
    //                     usuarios: usuarios,
    //                     uid: req.uid,
    //                     total: count,
    //                 });
    //             });

});


//==================================
//Crear un nuevo usuario
//==================================
const crearUsuario = ('/', async (req, res = response) => {

    const { email, password } = req.body;

    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        return res.status(400).json({
            ok: false,
            mensaje: `el correo ${email} ya se encuentra registrado`
        })
    }

    const usuario = new Usuario(
        //     // nombre: body.nombre,
        //     // email: body.email,
        //     // // password: bcrypt.hashSync(body.password, 10),
        //     // password: body.password,
        //     // img: body.img,
        //     // role: body.role
        req.body
    );

    //encriptar contrasena
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al crear usuario',
                errors: err
            });
        } else {
            //generar el JWT
            generarTokenOK(usuarioGuardado._id).then(respuesta =>
                res.status(201).json({
                    ok: true,
                    usuario: usuarioGuardado,
                    token: respuesta,
                    mensaje: "usuario guardado ok!"
                })
            ).catch(err => console.log(err))
        }
    });
});

const actualizarUsuario = (async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status.json({
                ok: false,
                mensaje: "no existe el usuario con ese id"
            })
        }

        //TODO: validar token y comprobar si el usuario es correcto

        const campos = req.body;

        if (usuarioDB.email === req.body.email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            console.log(existeEmail)
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `el correo ${campos.email} ya se encuentra registrado`
                })
            }
        }

        delete campos.password;
        delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.status(201).json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: "error en la actualizacion"
        })
    }
})

const eliminarUsuario = (async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                mensaje: "no existe el usuario con ese id"
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            mensaje: `usuario  eliminado correctamente`
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: `error en el servidor ${error}`
        })
    }
})

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}