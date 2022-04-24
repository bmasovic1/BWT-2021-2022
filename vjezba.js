const Sequelize = require("sequelize");


module.exports = function (sequelize, DataTypes) {
  const Vjezba = sequelize.define("Vjezba", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    index: Sequelize.STRING,
    vjezba: Sequelize.STRING,
    tacnost: Sequelize.STRING,
    promjena: Sequelize.STRING,
    greske: Sequelize.STRING(1638),
    testovi: Sequelize.STRING(1638),
  });

  return Vjezba;
};