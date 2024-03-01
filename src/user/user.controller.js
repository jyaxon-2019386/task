'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

// Register a user
export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

// Log a user
export const login = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let user = await User.findOne({ $or: [{ username: username }, { email: email }] });

        if (user && (await checkPassword(password, user.password))) {
            let loggedUser = {
                uid: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
            };
            let token = await generateJwt(loggedUser);
            return res.send({
                message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token
            });
        }

        return res.status(404).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error logging in' });
    }
};

//Update a user (profile)
export const update = async (req, res) => {
    try {
        // Obtener el ID del usuario a actualizar
        let { id } = req.params;
        // Obtener los datos a actualizar
        let data = req.body;
        // Validar si data trae datos
        let update = checkUpdate(data, id);
        if (!update) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });
        }
        // Buscar el usuario
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found and not updated' });
        }
        // Comprobar la contraseña actual
        if (data.oldPassword && !(await checkPassword(data.oldPassword, user.password))) {
            return res.status(400).send({ message: 'Incorrect old password' });
        }
        // Si se proporciona una nueva contraseña, actualizarla
        if (data.newPassword) {
            user.password = await encrypt(data.newPassword);
        }
        // Actualizar la información del perfil
        user = Object.assign(user, data);
        await user.save();
        // Responder al usuario
        return res.send({ message: 'Updated user', user });
    } catch (err) {
        console.error(err);
        if (err.keyValue.username) {
            return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` });
        }
        return res.status(500).send({ message: 'Error updating account' });
    }
};

