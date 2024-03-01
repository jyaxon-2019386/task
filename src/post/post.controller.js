'use strict'

import Post from './post.model.js'

export const createPost = async (req, res) => {
    try {
        // Obtener los datos de la post
        let { title, category, text, user } = req.body // Cambiar uid a user
        // Validar si los datos están presentes
        if (!title || !category || !text || !user) { // Cambiar uid a user
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        }
        // Crear la post
        let post = new Post({ title, category, text, user }) // Cambiar uid a user
        await post.save();
        // Responder al usuario
        return res.send({ message: 'Post created', post })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating post!' })
    }
}


export const updatePost = async (req, res) => {
    try {
        // Obtener el ID de la post a actualizar
        let { id } = req.params
        const userId = req.body.userId; // Obtener el ID del usuario desde el cuerpo de la solicitud
        // Obtener los datos de la post actualizada
        let { title, category, text } = req.body
        // Validar si los datos están presentes
        if (!title || !category || !text) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        }
        // Buscar la post
        let post = await Post.findById(id)
        if (!post) {
            return res.status(404).send({ message: 'Post not found and not updated' })
        }

        // Verificar si el usuario es el propietario de la publicación
        if (post.user.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }

        // Actualizar la post
        post.title = title
        post.category = category
        post.text = text
        await post.save()
        // Responder al usuario
        return res.send({ message: 'Post updated', post })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating post!' })
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId; // Obtener el ID del usuario desde el cuerpo de la solicitud

        // Buscar la publicación en la base de datos
        const post = await Post.findOne({ _id: id });

        if (!post) {
            return res.status(404).send({ message: 'Post not found and not deleted' });
        }

        // Verificar si el usuario es el propietario de la publicación
        if (post.user.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }

        // Eliminar la publicación si el usuario es el propietario
        const deletedPost = await Post.findOneAndDelete({ _id: id });

        return res.send({ message: 'Post deleted', deletedPost });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Post' });
    }
};




