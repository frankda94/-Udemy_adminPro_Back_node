//get Todo

const { Router } = require('express');
const { validarCampos } = require('../middlewares/validarCampos');
const { busquedaPorColeccion, busquedaDeTodo, } = require('../controllers/busquedaController');

const router = Router();

router.get('/:coleccion/:busqueda', busquedaPorColeccion);
router.get('/:busqueda', busquedaDeTodo);


module.exports = router;