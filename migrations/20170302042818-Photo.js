'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Photos', {
      author: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      }
   }); 
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Photos');
  }
};
