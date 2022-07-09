require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');

const gravatar = require('../util/gravatar');
const pg = require('../database/db');

module.exports = {
    newNote: async (_, args, {user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note');
        }
        const [newNote] = await pg("notes")
            .insert({
                author: "HVNSONN",
                content: args.content,
                user_id: user.id,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                favorite_count: 0
            })
            .returning("*")
        return newNote;
    },
    deleteNote: async (_, args, { user }) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }
        const [note] = await pg("notes").select("*").where("id", args.id);
        if (!note) {
            return false;
        }
        if (note && note.user_id !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note");
        }
        try {
            await pg("favorites")
                .where("note_id", args.id)
                .del()
            return pg("notes")
                .where('id', args.id)
                .del()
        } catch (e) {
            return false;
        }
    },
    updateNote: async (_, args, {user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }
        const [note] = await pg("notes").select("*").where("id", args.id);
        if (note && note.user_id !== user.id) {
            throw new ForbiddenError("You don't have permissions to update the note");
        }
        const [updatedNote] = await pg("notes")
            .update({
                content: args.content,
                updated: new Date().toISOString()
            })
            .where('id', args.id)
            .returning("*")
        return updatedNote;
    },
    signUp: async (_, {username, email, password}) => {
        email = email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const [user] = await pg("users")
                .insert({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    avatar: avatar
                })
                .returning("*")
            return jwt.sign({id: user.id}, process.env.JWT_SECRET);
        } catch (e) {
            console.log(e);
            throw new Error("Error creating account");
        }
    },
    signIn: async (_, {username, password, email}) => {
        if (email) {
            email = email.trim().toLowerCase();
        }
        const [user] = await pg("users")
            .where("email", email)
            .select("*")
        if (!user) {
            throw new AuthenticationError('Error signing in');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }
        return jwt.sign({id: user.id}, process.env.JWT_SECRET);
    },
    toggleFavorite: async (_, {id}, {user}) => {
        if (!user) {
            throw new AuthenticationError();
        }
        const [noteCheck] = await pg("favorites")
            .where("note_id", id)
            .select("*")

        const [note] = await pg("notes")
            .select("*")
            .where("id", id)

        const hasUser = await noteCheck ? noteCheck.user_id : 0;

        if (hasUser === user.id) {
            await pg("favorites")
                .where("note_id", id)
                .del()
            const [countDownNote] = await pg("notes")
                .where("id", id)
                .update("favorite_count", note.favorite_count - 1)
                .returning("*")
            return countDownNote;
        } else {
            await pg("favorites")
                .insert({
                    user_id: user.id,
                    note_id: id
                });
            const [countUpNote] = await pg("notes")
                .where("id", id)
                .update("favorite_count", note.favorite_count + 1)
                .returning("*")
            return countUpNote;
        }
    }
};