'use strict';
const bcrypt = require('bcrypt');
let saltRounds = 10;

module.exports = {

  

  up: function (queryInterface, Sequelize) {
  //   let createAdmin =
  //   return  
  //     (bcrypt.genSalt(saltRounds, function(err, salt) {
  //       bcrypt.hash("admin", salt, function(err, hash) {
  //         console.log("hash: ", hash)
  //        queryInterface.bulkInsert('Users',[{
  //                     username: "admin",
  //                     password: hash,
  //                     createdAt: new Date(),
  //                     updatedAt: new Date()
  //         }]);
  //       });
  //   }));
  },
  
   down: function (queryInterface, Sequelize) {
    
//       return queryInterface.bulkDelete('Person', null, {});

  }
};

