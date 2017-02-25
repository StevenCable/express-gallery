module.exports = function(sequelize, DataTypes) {
  var Photo = sequelize.define("Photo", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING,
    posted_by: DataTypes.INTEGER
  },  {
    classMethods: {
      associate: function(models) {
        Photo.belongsTo(models.User, {
          foreignKey: 'posted_by',
          as: 'user'
        });
      }
    }
  });

  return Photo;
};