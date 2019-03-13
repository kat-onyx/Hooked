const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require('graphql');
//The library used to build a schema and to execute queries on that schema. (Important peer dependenct of Apollo Server.)
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();

//CORS is needed to perform HTTP requests from another domain than your server domain to your server. 
app.use(cors())

//construct schema using GraphQL schema language.
//defines the shape of the data & which way the data can be fetched.
//string representing graphql schema
//gql = template literal tag used for writing GraphQL within JS
const schema = gql(`
    type Query {
        users: [Users!]
        me: User
        user(id: ID!): User
    }

    type User {
        id: ID!
        username: String!
        password: String!
        email: String!
    }
`);
// "!" means non-nullable field.

//resolvers are used to return data for fields from the schema
//map functions that implement the schema
//must add a resolver for every type of query
const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        me: () => {
            return {
                username: "kat",
                email: "kat@gmail.com",
                password: ""
            }
        },
        user: (parent, {id}) => {
            return users[id];
        }
    }
}
const server = new ApolloServer({
    typeDefs: schema,
    resolvers
});
//app here is from the existing Express app. (See above.) Integrating Apollo Server with Express server.
server.applyMiddleware({ app, path: '/graphql'});
// const root = {
//     hello: () => {
//         return 'Hello World';
//     },
// };


//creates a new express server

// app.get("/", (req, res) => res.send("hello world"));
// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true
// }));
const port = process.env.PORT || 4000;
//Locally server will run on port 5000.

app.listen(port, () => console.log('Running a GraphQL API server at localhost:4000/graphql'))
//sends a success message when server is running successfully.