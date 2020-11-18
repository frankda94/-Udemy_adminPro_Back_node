const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')
const fs = require('fs');

const borrarImagen = (directorioColeccion, coleccion) => {
    const pathViejo = `./uploads/${directorioColeccion}/${coleccion.img}`;
    if (fs.existsSync(pathViejo)) {
        //borra la imagen anterior
        fs.unlinkSync(pathViejo, (err) => {
            if (err) {
                return false;
            }
        })
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':

            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }
            borrarImagen('medicos', medico)
            medico.img = nombreArchivo;
            await medico.save();
            return true;

        case 'hospitales':

            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }
            borrarImagen('hospitales', hospital)
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }
            borrarImagen('usuarios', usuario)
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

    }
}

module.exports = {
    actualizarImagen
}