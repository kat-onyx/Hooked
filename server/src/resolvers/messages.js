import uuidv4 from 'uuid/v4';

const resolvers = {
    Query: {
        projects: (parent, args, { models }) => {
            return Object.values(models.projects)
        },
        project: (parent, { id }, { models }) => {
            return projects[id];
        }
    },
    Mutation: {
        //mutations also get a resolver. { me } here is the signed in user.
        createProject: (parent, { title, description }, { me, models }) => {
            //uuidv4 here will allow us to create a new project with a unique identifier.
            const id = uuidv4();
            const project = {
                id,
                title,
                description,
                userId: me.id
            };
            //doing this for now since our resolvers are not connected to the db
            models.projects[id] = project;
            models.users[me.id].projectIds.push(id);
            return project;
        },
        deleteProject: (parent, { id }, { models }) => {
            const { [id]: project, ...otherProjects } = models.projects;
            if (!project) {
                return false;
            }

            models.projects = otherProjects;
            return true;
        }
    },
    Project: {
        user: (project, args, { models }) => {
            return models.users[project.userId]
        }
    }
}