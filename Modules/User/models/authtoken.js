'use strict';

const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define('AuthToken', {
    token: DataTypes.STRING
  }, {});
  AuthToken.associate = (models) => {
    AuthToken.belongsTo(models.User);
  };

  // generates a random 15 character token and
  // associates it with a user
  AuthToken.generateJWT = async (user) => {
    if (!user) {
      throw new Error('AuthToken requires a user ID')
    }

    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let token = jwt.sign({
        email: user.email,
        id: user.id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'realtimeChat');
    
    let userId = user.id;
    return AuthToken.create({ token, userId })
  }

  return AuthToken;
};