export default {
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
        }
    }, User: {
        projects: user => {
            return Object.values(projects).filter(
                project => project.userId == user.id
            )
        }
    }
}