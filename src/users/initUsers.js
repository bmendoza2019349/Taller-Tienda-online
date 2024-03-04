import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Importar el modelo de usuario
import UserModel from './user.model.js';

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.URI_MONGO || 'mongodb://localhost:27017/tienda-en-linea', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado exitosamente.');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); // Termina la aplicación si no se puede conectar a MongoDB
    }
}

async function addUser(user) {
    try {
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(user.password, salt);

            await UserModel.create({
                name: user.name,
                email: user.email,
                password: hashedPassword, 
                phone: user.phone,
                role: user.role,
                state: user.estado,
            });

            console.log(`Usuario agregado: ${user.email}`);
        } else {
            console.log(`El usuario con correo ${user.email} ya existe en la base de datos. No se ha agregado.`);
        }
    } catch (error) {
        console.error(`Error al agregar el usuario con correo ${user.email}:`, error.message);
    }
}

async function addUsers() {
    await connectToMongo();

    const usersToInsert = [
        {
            name: 'dueño',
            email: 'dueño@example.com',
            password: '1234',
            phone: '12345678',
            role: 'ADMINISTRATOR',
            state: true,
        },
        // Puedes agregar más usuarios predefinidos según sea necesario
    ];

    for (const user of usersToInsert) {
        await addUser(user);
    }
}

export default addUsers;