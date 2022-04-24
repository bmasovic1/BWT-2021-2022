const Sequelize = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  const Grupa = sequelize.define("Grupa", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    grupa: Sequelize.STRING,
  });

  return Grupa;
};