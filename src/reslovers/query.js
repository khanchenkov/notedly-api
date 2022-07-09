const pg = require('../database/db');

module.exports = {
    notes: async () => await pg("notes").select("*").limit(100),
    note: async (_, args) => {
        const [note] = await pg("notes")
            .select("*")
            .where("id", args.id)
        return note;
    },
    users: async () => await pg("users").select("*"),
    user: async (_, args) => {
        const [user] = await pg("users").select("*").where("username", args.username);
        return user;
    },
    me: async (_, args, {user}) => {
        const [myData] = await pg("users").select("*").where("id", user.id);
        return myData;
    },
    noteFeed: async (_, {cursor}) => {
        const limit = 10;
        let hasNextPage = false;

        let cursorQuery = 0;

        if (cursor) {
            cursorQuery = cursor;
        }

        let notes = await pg("notes")
            .select("*")
            .where("id", ">", cursorQuery)
            .limit(limit+1)
            .orderBy("id", "desc")

        console.log(notes)

        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }

        const newCursor = notes[notes.length - 1].id;

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    },
};