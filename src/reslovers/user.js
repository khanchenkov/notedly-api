const pg = require("../database/db");

module.exports = {
    notes: async (user, args) => await pg("notes")
            .select("*")
            .where("user_id", user.id)
            .orderBy("id", "desc"),
    favorites: async (user, args) => {
        const favoriteNotes = await pg("favorites")
            .select("*")
            .where("user_id", user.id)
            .orderBy("id", "desc");
        const notes = favoriteNotes.map(item => item.note_id);
        return pg("notes")
            .select("*")
            .whereIn("id", notes)
    },
};