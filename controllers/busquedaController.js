const { response } = require('express');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

const busquedaPorColeccion = async (req, res = response) => {

    const coleccion = req.params.coleccion;
    const busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    try {
        switch (coleccion) {
            case 'hospitales':
                promesa = buscarHospitales(regex);
                break;
            case 'usuarios':
                promesa = buscarUsuarios(regex);
                break;
            case 'medicos':
                promesa = buscarMedicos(regex);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    mensaje: 'coleccion no encontrada'
                });
        }
        promesa.then(resultado => {
            res.status(200).json({
                ok: true,
                [coleccion]: resultado
            })
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "error al buscar coleccion"
        })
    }
}


// ==================================
//  Busqueda por todo
// ==================================
const busquedaDeTodo = async (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    await Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });
        });
}

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {
                if (err) {
                    reject('error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    });
}

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('error al cargar hospitales', err);
            } else {
                resolve(medicos)
            }
        });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al cargar usuarios', err)
                } else
                    resolve(usuarios)
            })
    });
}


module.exports = {
    busquedaPorColeccion,
    busquedaDeTodo,
}