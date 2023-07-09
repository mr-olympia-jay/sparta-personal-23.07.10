'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        // N(Comments):1(Users)
        targetKey: 'userId',
        foreignKey: 'userId',
      });
      this.belongsTo(models.UserInfos, {
        // N(Comments):1(UserInfos)
        sourceKey: 'userInfoId',
        foreignKey: 'userInfoId',
      });
      this.belongsTo(models.Posts, {
        // N(Comments):1(Posts)
        sourceKey: 'postId',
        foreignKey: 'postId',
      });
    }
  }
  Comments.init(
    {
      commentId: {
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
      },
      userInfoId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      postId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: DataTypes.INTEGER,
      },
      // ==================================================
      content: {
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
      modelName: 'Comments',
    }
  );
  return Comments;
};
