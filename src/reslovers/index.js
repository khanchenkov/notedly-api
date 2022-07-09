const Query = require('./query');
const Mutation = require('./mutation');
const User = require('./user');
const Note = require('./note');
const {GraphQLDateTime} = require("graphql-scalars");

module.exports = {
    Query,
    Mutation,
    User,
    Note,
    DateTime: GraphQLDateTime
};