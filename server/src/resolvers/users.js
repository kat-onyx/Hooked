const createToken = async (user) => {

}

export default {
//resolvers are used to return data for fields from the schema
//map functions that implement the schema
//must add a resolver for every type of query
    Query: {
        //passing in models as context keeps these resolver functions pure.
        users: async(parent, args, { models }) => {
            //use sequelize API to talk to DB and get data correctly.
            return await models.User.findAll();
        },
        //third arg is context, can be used to inject dependencies.  Pass context in on ApolloServer initialization.
        me: async(parent, args, { models, me }) => {
            //validation in the resolver
            if (!me) {
                return null;
            }
            return await models.User.findByPk(me.id);
        },
        user: async(parent, { id }, { models }) => {
            return models.User.findByPk(id);
        }
    }, User: {
        projects: async(user, args, { models }) => {
            return await models.Project.findAll({
                where: {
                    userId: user.id,
                }
            })
            // return Object.values(models.projects).filter(
            //     project => project.userId == user.id
            // )
        },
    }, Mutation: {
        signUp: async (parent, {username, email, password}, {models}) => {
            const user = await(models.User.create({
                username,
                email,
                password
            }));
            return { token: createToken(user) }
        }
    }
};
   // Normal User not needed here since the default query takes care of the username. Username resolver function is redundant!
    // User: {
    //     username: parent => {
    //         return parent.username
    //     }
    // }