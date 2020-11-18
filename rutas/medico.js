var express = require('express');
var app = express();

var mdAutenticacion = require('../middelware/autenticacion');

var Medico = require('../models/medico');

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(3)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar medicos,',
                        errors: err
                    });
                }
                Medico.countDocuments({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'get de medicos 200!',
                        medicos: medicos,
                        total: count
                    });
                })
            });
});


//==================================
//Crear un nuevo medico
//==================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario._id,
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario,
            mensaje: "medico guardado ok!"
        });
    });
});

// ==================================
// Obtener medico
// ==================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar  medico',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el medico con el id ' + id + ' no existe',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medico,
                mensaje: "retornando medico ok"
            })
        })

})

//==================================
//Actualizar un medico
//==================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar  medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el medico con el id' + id + 'no existe',
                errors: err
            });
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoActualizado,
                mensaje: "usuario actualizado ok!"
            });
        });
    });
});
// ==================================
// Borrar medico por ID
// ==================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al eliminar medico',
                errors: err
            });
        }
        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el medico con el id' + id + 'no existe',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoEliminado,
            mensaje: "  medico eliminado  ok!"
        });
    })

});

module.exports = app;