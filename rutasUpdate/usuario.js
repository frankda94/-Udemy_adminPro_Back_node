const { Router } = require('express');
const { check } = require('express-validator');
const {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario } = require('../controllers/usuarioController');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarToken, varlidarADMIN_ROLE, verificaADMIN_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();
/*
Ruta: /api/usuarios
*/

//==================================
//Obtener todos los usuarios
//==================================
// router.get('/', validarToken, getUsuarios);
router.get('/', [], getUsuarios);

router.post('/',
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('password', 'el password es obligatorio').not().isEmpty(),
        check('email', 'el campo debe ser tipo email').isEmail(),
        validarCampos,
    ],
    crearUsuario);

router.put('/:id',
    [
        validarToken, verificaADMIN_o_MismoUsuario,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('email', 'el campo debe ser tipo email').isEmail(),
        check('role', 'el rol es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario);

router.delete('/:id',[ validarToken, varlidarADMIN_ROLE], eliminarUsuario);



module.exports = router;