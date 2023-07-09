'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        // N(Posts):1(Users)
        targetKey: 'userId',
        foreignKey: 'userId',
      });
      this.belongsTo(models.UserInfos, {
        // N(Posts):1(UserInfos)
        targetKey: 'userInfoId',
        foreignKey: 'userInfoId',
      });
      this.hasMany(models.Comments, {
        // 1(Posts):N(Comments)
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: DataTypes.INTEGER,
      },
      // ==================================================
      userId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      userInfoId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      // ==================================================
      title: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false, // NOT NULL
        type: DataTypes.STRING,
      },
      likeCounts: {
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      modelName: 'Posts',
    }
  );
  return Posts;
};
