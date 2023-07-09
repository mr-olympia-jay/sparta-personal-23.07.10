// models>users.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // define association here
      this.hasOne(models.UserInfos, {
        // Users(model) => UserInfos(model) = 1:1
        sourceKey: 'userId', // Users(model)의 userId(column)을
        foreignKey: 'userId', // UserInfos(model)의 userId(column)와 연결합니다.
      });
      this.hasMany(models.Posts, {
        // Users(model) => Posts(model) = 1:N
        sourceKey: 'userId', // Users(model)의 userId(column)를
        foreignKey: 'userId', // Posts(model)의 userId(column)와 연결합니다.
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  return Users;
};
