const project = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        }
    });
    
    Project.associate = models => {
        Project.belongsTo(models.User)
    }
    return Project;
}

export default project;