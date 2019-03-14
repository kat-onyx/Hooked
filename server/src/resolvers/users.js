export default {
//resolvers are used to return data for fields from the schema
//map functions that implement the schema
//must add a resolver for every type of query
    Query: {
        //passing in models as context keeps these resolver functions pure.
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        },
        //third arg is context, can be used to inject dependencies.  Pass context in on ApolloServer initialization.
        me: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }, { models }) => {
            return users[id];
        }
    }, User: {
        projects: (user, args, { models }) => {
            return Object.values(models.projects).filter(
                project => project.userId == user.id
            )
        },
    },
};
   // Normal User not needed here since the default query takes care of the username. Username resolver function is redundant!
    // User: {
    //     username: parent => {
    //         return parent.username
    //     }
    // }