import { gql } from 'apollo-server-express';

import userSchema from './user';
import projectSchema from './project';

const linkSchema = gql`
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`

//here both schemas are merged
export default [linkSchema, userSchema, projectSchema]