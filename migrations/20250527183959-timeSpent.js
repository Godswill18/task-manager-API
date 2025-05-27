'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'timeSpent', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, 
      comment: 'Time spent on the task in minutes',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'timeSpent');
  }
};
