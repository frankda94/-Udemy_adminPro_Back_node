var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs-extra');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

app.use(fileUpload());

// ==================================
// Ruta para subir imagen
// ==================================
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'usuarios', 'medicos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo',
        });
    }
    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var extension = archivo.name.split('.');
    var extensionArchivo = extension[extension.length - 1];

    //validacion de extensiones permitidas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesPermitidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no permitida',
        });
    }
    //nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    //mover archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;


    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    })
})

function subirPorTipo(tipo, id, nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            subirPorUsuario(id, nombreArchivo, res);
            break;
        case 'hospitales':
            subirPorHospitales(id, nombreArchivo, res);
            break;
        case 'medicos':
            subirPorMedicos(id, nombreArchivo, res);
            break;
        default:
            break;
    }

}

function subirPorUsuario(id, nombreArchivo, res) {
    Usuario.findById(id, (err, usuario) => {
        if (err || !usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, no se encuentra imagen de usuario',
                errors: err
            });
        }
        var pathViejo = './uploads/usuarios/' + usuario.img;
        //si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "No se encuentra imagen del usuario para borrar.",
                    });
                }
            })
        }
        usuario.img = nombreArchivo;
        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar imagen de usuario',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                mensaje: 'imagen de usuario actualizada !',
                usuario: usuarioActualizado
            });
        });
    });
}
function subirPorHospitales(id, nombreArchivo, res) {
    Hospital.findById(id, (err, hospital) => {
        if (err || !hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, no se encuentra imagen de hospital',
                errors: err
            });
        }
        var pathViejo = './uploads/hospitales/' + hospital.img;
        //si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "No se encuentra imagen del hospital para borrar.",
                    });
                }
            })
        }
        hospital.img = nombreArchivo;
        hospital.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar imagen de hospital',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                mensaje: 'imagen de hospital actualizada !',
                hospital: hospitalActualizado
            });
        });
    });
}
function subirPorMedicos(id, nombreArchivo, res) {
    Medico.findById(id, (err, medico) => {
        if (err || !medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error, no se encuentra imagen de medico',
                errors: err
            });
        }
        var pathViejo = './uploads/medicos/' + medico.img;
        //si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "No se encuentra imagen del medico para borrar.",
                    });
                }
            })
        }
        medico.img = nombreArchivo;
        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar imagen de medico',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                mensaje: 'imagen de medico actualizada !',
                medico: medicoActualizado
            });
        });
    });
}

module.exports = app;