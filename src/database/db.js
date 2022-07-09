require("dotenv").config();

const isProduction = process.env.DEVELOPMENT;

let connection = {};

if (isProduction === 'true') {
    connection = {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "12345",
        database: "notedly_db"
    }
} else {
    connection = process.env.DATABASE_URL;
}

const pg = require("knex")({
    client: "pg",
    // searchPath: ['knex', 'public'],
    connection
});

module.exports = pg;