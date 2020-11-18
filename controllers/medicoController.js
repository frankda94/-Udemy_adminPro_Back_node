const { response } = require('express');
const Medico = require('../models/medico');

//==================================
//Obtener todos los medicos
//==================================

const getmedicos = async (req, res = response) => {
    const medicos = await Medico
        .find()
        .populate('hospital', ['nombre', 'img'])
        .populate('usuario', ['nombre', 'email', 'img'])

    res.status(200).json({
        ok: true,
        medicos
    })
}

// ==================================
// Obtener medico
// ==================================
const getmedico = async (req, res = response) => {

    var id = req.params.id;

    try {
        const medicoDb = await Medico
            .findById(id)
            .populate('hospital', ['nombre', 'img'])
            .populate('usuario', ['nombre', 'email', 'img'])

        res.status(200).json({
            ok: true,
            medico: medicoDb,
            mensaje: "retornando medico ok"
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "error al buscar medico"
        })
    }
}

const crearmedico = async (req, res = response) => {

    const medico = new Medico({
        usuario: req.uid,
        ...req.body
    });

    try {
        const medicoBD = await medico.save();
        res.status(201).json({
            ok: true,
            mensaje: "medico creado ",
            medico: medicoBD
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "error interno al crear medico"
        })
    }
}


const actualizarmedico = async (req, res = response) => {

    const id = req.params.id;
    try {
        const medicoDb = await Medico.findById(id);
        if (!medicoDb) {
            res.status(404).json({
                ok: false,
                mensaje: "medico no encontrado"
            })
        }
        const campos = req.body;
        campos.usuario = req.uid;
        const medicoActualizado = await Medico.findByIdAndUpdate(id, campos, { new: true });
        res.status(201).json({
            ok: true,
            medicoActualizado
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: "error en la actualizacion del medico"
        })
    }

}

const eliminarmedico = async (req, res = response) => {
    const id = req.params.id;
    try {
        const medicoDb = await Medico.findById(id);
        if (!medicoDb) {
            return res.status(404).json({
                ok: false,
                mensaje: "medico no encontrado"
            })
        }
        await Medico.findByIdAndDelete(id);
        return res.json({
            ok: true,
            mensaje: "medico eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: "error al eliminar medico"
        })
    }
}


module.exports = {
    getmedicos,
    getmedico,
    crearmedico,
    actualizarmedico,
    eliminarmedico
}