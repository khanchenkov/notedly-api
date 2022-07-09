const {gql} = require('apollo-server-express');

module.exports = gql`
    scalar DateTime
    type Note {
        id: ID!
        author: User!
        content: String!
        favorite_count: Int!
        favorited_by: [User]
        created: DateTime!
        updated: DateTime!
        user_id: ID!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
        favorites: [Note!]!
    }
    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNextPage: Boolean!
    }
    type Query {
        noteFeed(cursor: String): NoteFeed
        notes: [Note!]!
        note(id: ID!): Note!
        user(username: String!): User
        users: [User!]!
        me: User!
        isLoggedIn: Boolean!
    }
    type Mutation {
        newNote(content: String!): Note
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
        toggleFavorite(id: ID!): Note!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String!, password: String!): String!
    }
`;