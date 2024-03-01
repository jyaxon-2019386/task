'use strict'

import User from './user.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

// Register a user
export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
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
