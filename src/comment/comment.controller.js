'use strict'

import Comment from './comment.model.js'
import Post from '../post/post.model.js'

export const addCommentToPost = async (req, res) => {
    try {
        // Obtener el ID de la publicación a la que se agregará el comentario
        let { id } = req.params;

        // Extraer user y text del cuerpo de la solicitud
        const { user, comms } = req.body;

        // Validar el ID de la publicación
        if (!id) {
            return res.status(400).json({ message: 'ID de la publicación no válido' });
        }

        // Buscar la publicación correspondiente en 'posts'
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        // Validar los datos del cuerpo de la solicitud
        if (!user || !comms) {
            return res.status(400).json({ message: 'Datos del cuerpo de la solicitud no válidos' });
        }

        // Agregar el comentario a la publicación
        if (!post.comments) {
            post.comments = [];
        }
        post.comments.push({ user, comms });

        // Actualizar la publicación con el nuevo comentario utilizando findOneAndUpdate
        const updatedPost = await Post.findOneAndUpdate(
            { _id: post._id },
            { $push: { comments: { user, comms } } },
            { new: true }
        );

        console.log('Comentario agregado correctamente:', updatedPost);
        
        return res.status(201).json({ message: 'Comentario agregado correctamente', post: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al agregar el comentario a la publicación' });
    }
}



export const editComment = async (req, res) => {
    try {
        // Obtener el ID del comentario a editar
        const commentId = req.params.id;

        // Buscar el comentario
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found and not edited' });
        }

        // Verificar si el usuario es el propietario del comentario
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not the owner of this comment' });
        }

        // Actualizar el comentario
        comment.text = req.body.text;
        await comment.save();

        // Responder al usuario
        return res.send({ message: 'Comment edited', comment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error editing comment!' });
    }
};
