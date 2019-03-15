const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        // password: {
        //     type: DataTypes.STRING,
        //     unique: true
        // }
    });
    //creating a hasMany relationship for User to Project.
    User.associate = models => {
        User.hasMany(models.Project);
    };

    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { username: login}
        });

        if (!user) {
            user = await User.findOne({
                where: { email: login}
            });
        }
        return user;
    }
    return User;
}

export default user;