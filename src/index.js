require('dotenv').config();
const isDevelopment = process.env.DEVELOPMENT === 'true';

const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const depthLimit = require("graphql-depth-limit");
const {createComplexityLimitRule} = require("graphql-validation-complexity");
const jwt = require('jsonwebtoken');
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const port = process.env.PORT ?? 4000;

app.use(helmet({
    crossOriginEmbedderPolicy: !isDevelopment,
    contentSecurityPolicy: !isDevelopment,
}),);
app.use(cors());

const typeDefs = require('./schema');
const resolvers = require('./reslovers');

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            new Error('Session invalid');
        }
    }
};

let server = null;
(async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
        context: async ({ req }) => {
            const token = req.headers.authorization;
            const user = await getUser(token);
            return {user};
        }
    });
    await server.start();
    server.applyMiddleware({ app, path: `/api`});
})()

app.get('/', (req, res) => res.send('Hello World'));

app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));
