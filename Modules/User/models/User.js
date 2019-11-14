'use strict';
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        // state_id: {
        //     type: Sequelize.INTEGER,

        //     references: {
        //         // This is a reference to another model
        //         model: State,

        //         // This is the column name of the referenced model
        //         key: 'id',
        //     }
        // },
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

    User.associate = function(models) {
        User.hasMany(models.AuthToken)
    };
    

    User.addHook("beforeCreate", function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    
    User.prototype.isValid = function(hashedPassword) {
        return bcrypt.compareSync(hashedPassword, this.password);
    }    

    User.prototype.authorize = async function () {
        const  {AuthToken}  = sequelize.models;
        const user = this

        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
    
        let token = jwt.sign({
                email: user.email,
                id: user.id,
                exp: parseInt(expirationDate.getTime() / 1000, 10),
            }, 'Fashion-Cast');
        let UserId = user.id;
        let authToken = await AuthToken.create({ token, UserId })

        await user.addAuthToken(authToken);
        let accessToken = authToken.token;
        return { user, accessToken }
    };

    
    return User;
};