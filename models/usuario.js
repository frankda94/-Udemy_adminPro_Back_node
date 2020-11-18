var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = moongose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: [true, ""], required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'la contraseña es necesaria'] },
    img: { type: String },
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
});
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });

usuarioSchema.method('toJSON', function () {
    const { __v, _id, password, ...Object } = this.toObject();
    Object.uid = _id;
    return Object;
})


module.exports = moongose.model('Usuario', usuarioSchema);