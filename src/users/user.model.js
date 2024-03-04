import mongoose from 'mongoose';

// Definir el esquema para el modelo de usuario
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  nit: {
    type: String,
    minLength: 9,
    maxLength: 9,
    required: [false, "El nit es obligatorio"],
  },
  role: {
    type: String,
    default: "CLIENT",
    enum: ["ADMINISTRATOR", "CLIENT"],
  },
  state: {
    type: Boolean,
    default: true,
  }
});

// Modificar el método toJSON para excluir campos no deseados en la respuesta
UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

// Exportar el modelo de usuario
export default mongoose.model('User', UserSchema);
