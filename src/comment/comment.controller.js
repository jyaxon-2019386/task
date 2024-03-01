'use strict'

import Post from '../post/post.model.js'

export const addCommentToPost = async (req, res) => {
    try {
        // Obtener el ID de la publicación a la que se agregará el comentario
        let { id } = req.params;

        // Extraer user y comms del cuerpo de la solicitud
        const { user, comms } = req.body;

        // Validar el ID de la publicación
        if (!id) {
            return res.status(400).send({ message: 'Invalid post ID' });
        }

        // Buscar la publicación correspondiente en 'posts'
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Validar los datos del cuerpo de la solicitud
        if (!user || !comms) {
            return res.status(400).send({ message: 'Invalid request body data' });
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
        
        return res.status(201).send({ message: 'Comment added successfully!', post: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error adding comment to post!' });
    }
}

export const editComment = async (req, res) => {
  try {
      // Obtener el ID del comentario a editar
      let { id } = req.params;
      const userId = req.body.userId; // Obtener el ID del usuario desde el cuerpo de la solicitud

      // Buscar el comentario correspondiente en la base de datos
      const post = await Post.findOne({ 'comments._id': id });

      if (!post) {
          return res.status(404).send({ message: 'Comment not found' });
      }

      // Encontrar el comentario específico dentro del array de comentarios
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === id);

      if (commentIndex === -1) {
          return res.status(404).send({ message: 'Comment not found' });
      }

      // Verificar si el usuario es el autor del comentario
      if (post.comments[commentIndex].user.toString() !== userId) {
          return res.status(403).send({ message: 'You are not authorized to edit this comment' });
      }

      // Extraer los datos del cuerpo de la solicitud para la edición del comentario
      const { newComms } = req.body;

      // Validar los datos del cuerpo de la solicitud para la edición del comentario
      if (!newComms) {
          return res.status(400).send({ message: 'Invalid request body data for editing comment' });
      }

      // Actualizar el texto del comentario
      post.comments[commentIndex].comms = newComms;

      // Guardar los cambios en el post
      await post.save();

      // Encontrar el comentario actualizado en el array de comentarios
      const updatedComment = post.comments[commentIndex];

      return res.status(200).send({ message: 'Comment edited successfully!', comment: updatedComment });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error editing comment' });
  }
};


  //Delete a comment
  export const deleteComment = async (req, res) => {
    try {
        let { id }= req.params;
        const userId = req.body.userId; // Obtener el ID del usuario desde el cuerpo de la solicitud

        // Buscar el post correspondiente en la base de datos
        const post = await Post.findOne({ 'comments._id': id });

        if (!post) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Encontrar el comentario específico dentro del array de comentarios
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === id);

        if (commentIndex === -1) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Verificar si el usuario es el autor del comentario
        if (post.comments[commentIndex].user.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to delete this comment' });
        }

        // Eliminar el comentario del array de comentarios
        post.comments.splice(commentIndex, 1);

        // Guardar los cambios en el post
        await post.save();

        console.log('Comentario eliminado correctamente');

        return res.status(200).send({ message: 'Comment deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting comment' });
    }
};






