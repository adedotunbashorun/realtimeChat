'use strict';
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.TEXT
        },
    }, {});
    Notification.associate = function (models) {
        // associations can be defined here
    };
    return Notification;
};