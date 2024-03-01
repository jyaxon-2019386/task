'use strict'

import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'
import Post from '../post/post.model.js'

export const validateJwt = async(req, res, next) => {
    try {
        // Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY;
        // Obtener el token de los headers
        let { authorization } = req.headers;
        // Verificar si viene el token
        if (!authorization) return res.status(401).send({ message: 'Unauthorized' });
        // Obtener el uid del usuario que envió el token
        let { uid } = jwt.verify(authorization, secretKey);
        // Validar si aún existe en la BD
        let user = await User.findOne({ _id: uid });
        if (!user) return res.status(404).send({ message: 'User not found - Unauthorized' });
        // Verificar si el usuario es el propietario de la publicación
        let post = await Post.findOne({ _id: req.params.id, user: uid });
        if (!post) return res.status(403).send({ message: 'You don\'t have access to edit this post' });
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: 'Invalid token' });
    }
};

export const isAdminOrOwner = async (req, res, next) => {
    try {
      const { user } = req;
      if (!user) {
        return res.status(403).send({ message: `You don't have access | username: ${user.username}` });
      }
  
      // Extract the user ID from the token
      const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
      const userIdFromToken = decodedToken.id;
  
      // Check if the user making the request is the same user who created the post
      const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      if (post.user.toString() !== userIdFromToken) {
        return res.status(403).send({ message: 'You don\'t have access to edit this post' });
      }
  
      next();
    } catch (err) {
      console.error(err);
      return res.status(403).send({ message: 'Unauthorized role' });
    }
  };

