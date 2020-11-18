const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizarImagen");
const path = require('path');
var fs = require('fs');



const fileUpload = async (req, res = response) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'usuarios', 'medicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
        });
    }

    //valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: "no ha seleccionado archivo"
        })
    }
    //PROCESAR EL ARCHIVO
    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var extension = archivo.name.split('.');
    var extensionArchivo = extension[extension.length - 1];

    //validacion de extensiones permitidas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (!extensionesPermitidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no permitida',
        });
    }
    //nombre de archivo personalizado
    var nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
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
        //actualizarImagen
        actualizarImagen(tipo, id, nombreArchivo);

        res.status(200).json({
            ok: true,
            nombreArchivo
        })
        // subirPorTipo(tipo, id, nombreArchivo, res);
    })
}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const imagen = req.params.imagen

    const pathImagen = path.join(__dirname, `../uploads/${tipo}/${imagen}`)

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`)
        res.sendFile(pathNoImage);
    }
}


module.exports = {
    fileUpload,
    retornaImagen
}