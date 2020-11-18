const { Router } = require('express');
const { getmedicos,
    crearmedico,
    actualizarmedico,
    eliminarmedico,
    getmedico } = require('../controllers/medicoController');
const { validarToken } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

router.get('/', getmedicos);

router.get('/:id', getmedico);

router.post('/',
    [
        validarToken,
        check("nombre", "el nombre es requerido").not().isEmpty(),
        check("hospital", "el hospital id debe ser valido").isMongoId(),
        validarCampos
    ],
    crearmedico);

router.put('/:id',
    [validarToken,
        check('nombre', 'el nombre es necesario').not().isEmpty(),
        check("hospital", "el hospital id debe ser valido").isMongoId(),
        validarCampos
    ],
    actualizarmedico);

router.delete('/:id',
    [
        validarToken,
        // check('medico', 'el medico id debe ser valido').isMongoId(),
        // validarCampos
    ],
    eliminarmedico);


module.exports = router;
