'use strict';

const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define('AuthToken', {
    token: DataTypes.STRING
  }, {});
  AuthToken.associate = function(models) {
    AuthToken.belongsTo(models.User);
  };

  // generates a random 15 character token and
  // associates it with a user
  AuthToken.prototype.generateJWT = async function(UserId) {
    if (!UserId) {
      throw new Error('AuthToken requires a user ID')
    }

    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
  
    let token = jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'Fashion-Cast');
    
    return AuthToken.create({ token, UserId })
  }

  return AuthToken;
};