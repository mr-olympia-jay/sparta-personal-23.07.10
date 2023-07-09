'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserInfos', {
      userInfoId: {
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
      // ==================================================
      nickname: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      userDesc: {
        allowNull: true, // NULL
        type: Sequelize.STRING,
      },
      likePostIds: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
        defaultValue: '',
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserInfos');
  },
};
