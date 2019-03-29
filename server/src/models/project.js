const project = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: true,
            }
        }
    });
    
    Project.associate = models => {
        Project.belongsTo(models.User)
    }
    return Project;
}

export default project;