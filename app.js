const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require('graphql');
//The library used to build a schema and to execute queries on that schema. (Important peer dependenct of Apollo Server.)
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const uuidv4 = require('uuid/v4');

const app = express();

//CORS is needed to perform HTTP requests from another domain than your server domain to your server. 
app.use(cors())

//construct schema using GraphQL schema language.
//defines the shape of the data & which way the data can be fetched.
//string representing graphql schema
//gql = template literal tag used for writing GraphQL within JS
//the graphql "query" is for fetching data, similar to the get request. Acts as an entry point.
const schema = gql(`
    type Query {
        users: [User!]
        me: User
        user(id: ID!): User

        projects: [Project!]!
        project(id: ID!): Project!
    }

    type User {
        id: ID!
        username: String!
        email: String
        projects: [Project!]
    }

    type Project {
        id: ID!
        description: String!
        title: String!
        user: User!
    }

    type Mutation {
        createProject(title: String!, description: String!): Project!
    }
`);
// "!" means non-nullable field.
let users = {
    1: {
        id: '1',
        username: 'kat',
        projectIds: [1]
    },
    2: {
        id: '2',
        username: 'jon'
    }
}

let projects = {
    1: {
        id: "1",
        description: "Luke Skywalker amigurimu, using a 5mm hook...",
        title: "Luke Skywalker",
        userId: "1",
    },
    2: {
        id: "2",
        description: "Yoshi amigurumi, using a 6mm hook and some green yarn.",
        title: "Yoshi",
        userId: "2"
    }
}
//resolvers are used to return data for fields from the schema
//map functions that implement the schema
//must add a resolver for every type of query
const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        //third arg is context, can be used to inject dependencies.  Pass context in on ApolloServer initialization.
        me: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }) => {
            return users[id];
        },
        projects: () => {
            return Object.values(projects)
        },
        project: (parent, { id }) => {
            return projects[id];
        }
    },
    //User not needed here since the default query takes care of the username. Username resolver function is redundant!
    // User: {
    //     username: parent => {
    //         return parent.username
    //     }
    // }
    Project: {
        user: project => {
            return users[project.userId]
        }
    },
    User: {
        projects: user => {
            return Object.values(projects).filter(
                project => project.userId == user.id
            )
        }
    },
    Mutation: {
        //mutations also get a resolver. { me } here is the signed in user.
        createProject: (parent, { title, description }, { me }) => {
            //uuidv4 here will allow us to create a new project with a unique identifier.
            const id = uuidv4();
            const project = {
                id,
                title,
                description,
                userId: me.id
            };
            //doing this for now since our resolvers are not connected to the db
            projects[id] = project;
            users[me.id].messagesIds.push(id);
            return project;
        }
    }
}
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    }
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