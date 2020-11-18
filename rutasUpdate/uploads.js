/**
 * ruta: api/uploads
 */

const { Router } = require('express');
const { validarCampos } = require('../middlewares/validarCampos');
const { fileUpload, retornaImagen } = require('../controllers/uploadsController');
const { validarToken } = require('../middlewares/validar-jwt');
const expressFileUpload = require('express-fileupload');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', fileUpload);
router.get('/:tipo/:imagen', retornaImagen);


module.exports = router;