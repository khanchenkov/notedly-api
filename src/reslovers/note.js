const pg = require("../database/db");

module.exports = {
    author: async (note, args) => {
        const [author] = await pg("users")
            .select("*")
            .where("id", note.user_id);
        return author;
    },
    favorited_by: async (note, args) => {
        const usersId = await pg("favorites")
            .select("*")
            .where("note_id", note.id);
        const users = usersId.map(item => item.user_id);
        return pg("users")
            .select("*")
            .whereIn("id", users)
    }
};