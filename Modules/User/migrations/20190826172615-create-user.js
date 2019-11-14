'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      // stateId: {
      //   type: Sequelize.UUID,
      //   references: {
      //     model: 'States', // name of Source model
      //     key: 'id',
      //   },
      //   foreignKey: true
      // },
      email: {
        type: Sequelize.STRING,
        uniqueKey: true
      },
      phone: {
        type: Sequelize.STRING,
        uniqueKey: true
      },
      address: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }, 
      last_login: {
          type: Sequelize.DATE
      },
      is_active: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'inactive'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};