import express from 'express';
// const graphqlHTTP = require("express-graphql");
// const { buildSchema } = require('graphql');
//The library used to build a schema and to execute queries on that schema. (Important peer dependenct of Apollo Server.)
// const { ApolloServer, gql } = require('apollo-server-express');
import cors from 'cors';

import { ApolloServer } from 'apollo-server-express'

import schema from './schema/app';
import resolvers from './resolvers/app';
import models, { sequelize } from './models/app';

const app = express();

//CORS is needed to perform HTTP requests from another domain than your server domain to your server. 
app.use(cors())


// const resolvers = {
//     Query: {
//         users: () => {
//             return Object.values(users);
//         },
//         //third arg is context, can be used to inject dependencies.  Pass context in on ApolloServer initialization.
//         me: (parent, args, { me }) => {
//             return me;
//         },
//         user: (parent, { id }) => {
//             return users[id];
//         },
//         projects: () => {
//             return Object.values(projects)
//         },
//         project: (parent, { id }) => {
//             return projects[id];
//         }
//     },
 
//     Mutation: {
//         //mutations also get a resolver. { me } here is the signed in user.
//         createProject: (parent, { title, description }, { me }) => {
//             //uuidv4 here will allow us to create a new project with a unique identifier.
//             const id = uuidv4();
//             const project = {
//                 id,
//                 title,
//                 description,
//                 userId: me.id
//             };
//             //doing this for now since our resolvers are not connected to the db
//             projects[id] = project;
//             users[me.id].projectIds.push(id);
//             return project;
//         },
//         deleteProject: (parent, { id }) => {
//             const { [id]: project, ...otherProjects } = projects;
//             if (!project) {
//                 return false;
//             }

//             projects = otherProjects;
//             return true;
//         }
//     },
//     Project: {
//         user: project => {
//             return users[project.userId]
//         }
//     },
//     User: {
//         projects: user => {
//             return Object.values(projects).filter(
//                 project => project.userId == user.id
//             )
//         }
//     },

// }
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        //remove the internal sequelize error message
        //leave only the important validation error
        const message = error.message
            .replace("SequelizeValidationError: ", "")
            .replace("Validation error: ", "");
        
        return {
            ...error,
            message,
        };
    },
    context: async () => ({
        models,
        me: await models.User.findByLogin('lauren')
    })
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

const eraseDatabaseOnSync = true;

//the force flag can be used to see the db on every app startup.
//needs to TODO: BE REMOVED FOR PROD PURPOSES SINCE ALL WILL BE WIPED.
sequelize.sync({ force: eraseDatabaseOnSync }).then(async() => {
    if (eraseDatabaseOnSync) {
        createUserWithProjects();
    }
    app.listen(port, () => console.log('Running a GraphQL API server at localhost:4000/graphql'))
});

const createUserWithProjects = async () => {
    await models.User.create(
        {
            username: "kat",
            email: "kat@g.com",
            password: "1234567",
            projects: [
                {
                    title: "Luke Skywalker Crochet",
                    description: "Luke Skywalker made with a 5mm hook.  Brown Yarn. White Yarn. Beige Yarn."
                },
            ],
        },
        {
            include: [models.Project],
        }
    );

    await models.User.create(
        {
            username: "lauren",
            email: "lauren@g.com",
            password: "1234567",
            projects: [
                {
                    title: "Toddler Clothes",
                    description: "Toddler clothes created with soft cotton. Need a 6mm hook."
                },
            ],
        },
        {
            include: [models.Project],
        }
    );
};

//sends a success message when server is running successfully.