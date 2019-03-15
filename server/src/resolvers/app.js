import userResolvers from '../resolvers/users';
import projectResolvers from './project';

export default [userResolvers, projectResolvers];

//sequelize is a promise based ORM so we use async/await.
// Always returns a JS promise when operating on a db
