const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require('graphql');

//construct schema using GraphQL schema language
const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
    hello: () => {
        return 'Hello World';
    },
};

const app = express();
//creates a new express server

// app.get("/", (req, res) => res.send("hello world"));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
const port = process.env.PORT || 4000;
//Locally server will run on port 5000.

app.listen(port, () => console.log('Running a GraphQL API server at localhost:4000/graphql'))
//sends a success message when server is running successfully.