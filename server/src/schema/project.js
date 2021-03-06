import { gql } from 'apollo-server-express';

// "!" means non-nullable field.
//since there is more than one of the type Query and Mutation (and possibly others later), we need to extend this.
//construct schema using GraphQL schema language.
//defines the shape of the data & which way the data can be fetched.
//string representing graphql schema
//gql = template literal tag used for writing GraphQL within JS
//the graphql "query" is for fetching data, similar to the get request. Acts as an entry point.
export default gql`
    extend type Query {
        projects: [Project!]!
        project(id: ID!): Project!
    }

    extend type Mutation {
        createProject(title: String!, description: String!): Project!
        deleteProject(id: ID!): Boolean!
    }

    type Project {
        id: ID!
        description: String!
        title: String!
        user: User!
    }
`