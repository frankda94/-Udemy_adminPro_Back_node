const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital } = require('../controllers/hospitalController');
const { validarToken } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');


const router = Router();

router.get('/', [], getHospitales);

router.post('/',
    [validarToken,
        check('nombre', 'el nombre es necesario').not().isEmpty(),
        validarCampos
    ]
    , crearHospital);

router.put('/:id',
    [validarToken,
        check("nombre", "el nombre es necesario").not().isEmpty(),
        validarCampos
    ], actualizarHospital);

router.delete('/:id',
    [validarToken,
        // check("hospital", "el hospital id debe ser valido").isMongoId(),
        // validarCampos
    ],
    eliminarHospital);


module.exports = router;
