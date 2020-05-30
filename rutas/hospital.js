var express = require('express');
var app = express();

var mdAutenticacion = require('../middelware/autenticacion');

var Hospital = require('../models/hospital');

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar hospitales,',
                        errors: err
                    });
                }
                Hospital.count({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'get de hospitales 200!',
                        hospitales: hospitales,
                        total: count
                    });
                })

            });
});


//==================================
//Crear un nuevo hospital
//==================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario,
            mensaje: "hospital guardado ok!"
        });
    });
});


//==================================
//Actualizar un hospital
//==================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar  hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital con el id' + id + 'no existe',
                errors: err
            });
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalActualizado,
                mensaje: "usuario actualizado ok!"
            });
        });
    });
});
// ==================================
// Borrar hospital por ID
// ==================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al eliminar hospital',
                errors: err
            });
        }
        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital con el id' + id + 'no existe',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado,
            mensaje: "hospital eliminado  ok!"
        });
    })

});

module.exports = app;