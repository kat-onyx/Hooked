import bcrypt from 'bcryptjs';

const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            //add database level validations here in the model.
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [7, 42]
            }
        }
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
    };
    //hook function
    User.beforeCreate(async user => {
        user.password = await user.generatePasswordHash();
    });
    User.prototype.generatePasswordHash = async function() {
        const saltRounds = 10;
        return await bcrypt.hash(this.password, saltRounds);
    }
    return User;
}

export default user;