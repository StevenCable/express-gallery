module.exports = function(sequelize, DataTypes) {
  var Password = sequelize.define("Password", {
    password: DataTypes.STRING    
  }, {
    // classMethods: {
    //   associate: function(models) {
    //     User.hasOne(models.Password);
    //   }
    // }
  });

  return Password;
};