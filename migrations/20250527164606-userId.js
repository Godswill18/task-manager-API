'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', // Name of the referenced table
        key: 'id' // Key in the referenced table
      },
      onUpdate: 'CASCADE', // Update the foreign key if the referenced key is updated
      onDelete: 'SET NULL', // Set the foreign key to NULL if the referenced key is deleted
      allowNull: false,
      comment: 'ID of the user who the task is assigned to'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'userId');
  }
};
