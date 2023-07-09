// models>userinfos.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfos extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        // UserInfos => Users = 1:1
        targetKey: 'userId',
        foreignKey: 'userId',
      });
      this.hasMany(models.Comments, {
        // 1(Userinfos):N(Comments)
        sourceKey: 'userInfoId',
        foreignKey: 'userInfoId',
      });
    }
  }
  UserInfos.init(
    {
      userInfoId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key
        type: DataTypes.INTEGER,
      },
      // ==================================================
      userId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
        unique: true,
      },
      // ==================================================
      nickname: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true,
      },
      userDesc: {
        allowNull: true, // NULL
        type: DataTypes.STRING,
      },
      likePostIds: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
        defaultValue: '',
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
      modelName: 'UserInfos',
    }
  );
  return UserInfos;
};
