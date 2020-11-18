/**
 * path: api/login
 */

const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/authController');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarToken } = require('../middlewares/validar-jwt');


const router = Router();

router.post('/',
    [
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password es obligatorio').not().isEmpty(),
        validarCampos
    ], login);

router.post('/google',
    [
        validarCampos
    ], googleSignIn);

router.get('/renewToken',
    [
        validarToken
    ], renewToken);


module.exports = router;