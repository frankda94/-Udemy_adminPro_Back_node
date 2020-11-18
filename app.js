//requerimientos
var express = require('express');
//variables de entorno
require('dotenv').config();
const path = require('path');
//cors
const cors = require('cors');
//bd
const { dbConnection } = require('./database/configDd')

// var appRoutes = require('./rutas/app');
// var appRoutesUsuario = require('./rutas/usuario');
// var appRoutesUsuarioLogin = require('./rutas/login');
// var appRoutesHospital = require('./rutas/hospital');
// var appRoutesMedico = require('./rutas/medico');
// var appRoutesBusqueda = require('./rutas/busqueda');
// var appRoutesUpload = require('./rutas/upload');
// var appRoutesImagen = require('./rutas/imagenes');
// var bodyParser = require('body-parser');


//inicializar varaables
var app = express();

//conexion a la bd local
// moongose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
//     if (err) throw err;
//     console.log("conectado a bdd " + res)
// });
//conexion a la bd mongoAtlas
dbConnection();

//variables de entorno
// console.log(process.env);

//directorio publico
app.use(express.static('public'));

//politica de CORS
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     next();
// });
app.use(cors());

//body-parser
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());





//rutas
app.use('/api/usuarios', require('./rutasUpdate/usuario'));
app.use('/api/login', require('./rutasUpdate/auth'));
app.use('/api/hospitales', require('./rutasUpdate/hospitales'));
app.use('/api/medicos', require('./rutasUpdate/medicos'));
app.use('/api/todo', require('./rutasUpdate/busqueda'));
app.use('/api/uploads', require('./rutasUpdate/uploads'));

//comodin para que en despliegue pase por el index
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


//escuchar servidor
app.listen(process.env.PORT, () => {
    console.log("servidor corriendo en puerto: \x1b[32m%s\x1b[0m'", process.env.PORT);
});