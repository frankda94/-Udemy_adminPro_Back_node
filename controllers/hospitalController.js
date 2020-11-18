const { response } = require('express');
const Hospital = require('../models/hospital');
//==================================
//Obtener todos los hospitales
//==================================

const getHospitales = ('/', async (req, res = response) => {
    try {
        var desde = Number(req.query.desde) || 0;

        const [hospitales, total] = await Promise.all([
            Hospital.find()
            .skip(desde)
            .populate('usuario', ['nombre', 'email', 'img']),

            Hospital.countDocuments()
        ])
        res.status(200).json({
            ok: true,
            hospitales,
            total
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        })
    }
});

const crearHospital = async (req, res = response) => {

    const hospital = new Hospital(
        {
            usuario: req.uid,
            ...req.body
        }

    );
    try {
        const hospitalDB = await hospital.save();

        return res.status(201).json({
            ok: true,
            mensaje: "hospital creado",
            hospital: hospitalDB
        })
    } catch (error) {

        return res.status(500).json({
            ok: false,
            mensaje: "error inesperado al crear hospital"
        })
    }

}


const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;

    try {
        const hospitalDb = await Hospital.findById(id);
        if (!hospitalDb) {
            res.status(404).json({
                ok: false,
                mensaje: "hospital no encontrado"
            })
        }
        const campos = req.body;
        campos.usuario = req.uid;
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, campos, { new: true });
        res.status(201).json({
            ok: true,
            hospitalActualizado
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: "error en la actualizacion del hospital"
        })
    }

}

const eliminarHospital = async (req, res = response) => {

    const id = req.params.id;
    console.log(id);
    try {
        const hospitalDb = await Hospital.findById(id);
        if (!hospitalDb) {
            return res.status(404).json({
                ok: false,
                mensaje: "hospital no encontrado"
            })
        }
        await Hospital.findByIdAndDelete(id);
        return res.json({
            ok: true,
            mensaje: "hospital eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: "error al eliminar hospital"
        })
    }
}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}