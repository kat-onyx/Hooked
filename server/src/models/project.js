const project = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    //add custom errors for createProject mutation in model-level allows for specificity.
                    args: true,
                    msg: "Project must have a title."
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Project must have a description."
                }
            }
        }
    });
    
    Project.associate = models => {
        Project.belongsTo(models.User)
    }
    return Project;
}

export default project;