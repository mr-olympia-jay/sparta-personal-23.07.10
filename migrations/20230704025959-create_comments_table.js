'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      commentId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key
        type: Sequelize.INTEGER,
      },
      // ==================================================
      userId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      userInfoId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'UserInfos',
          key: 'userInfoId',
        },
        onDelete: 'CASCADE',
      },
      postId: {
        // Foreign Key
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'postId',
        },
        onDelete: 'CASCADE',
      },
      // ==================================================
      content: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  },
};
