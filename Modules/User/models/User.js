'use strict';
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        address: {
            type: DataTypes.TEXT
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                min: 6
            },
            allowNull: false
        }, 
        last_login: {
            type: DataTypes.DATE
        },
        is_active: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'inactive'
        }
    }, {});

    User.associate = (models) => {
        User.hasMany(models.AuthToken);
    };
    

    User.addHook("beforeCreate", (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    
    User.prototype.isValid = (hashedPassword) => {
        return bcrypt.compareSync(hashedPassword, this.password);
    }    

    User.prototype.authorize = async () => {
        const  {AuthToken}  = sequelize.models;
        const user = this
        
        let authToken = await AuthToken.generateJWT(user, this.id);

        await user.addAuthToken(authToken);
        return { user, authToken }
    };
    
    User.prototype.logout = async (token) => {

        // destroy the auth token record that matches the passed token
        sequelize.models.AuthToken.destroy({ where: { token } });
    };
    return User;
};