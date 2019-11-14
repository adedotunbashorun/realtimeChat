'use strict';
module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    description:{
      type: DataTypes.TEXT
    },
    ip_address: {
      type: DataTypes.STRING
    }
  }, {});
  ActivityLog.associate = function(models) {
    // associations can be defined here
  };
  return ActivityLog;
};