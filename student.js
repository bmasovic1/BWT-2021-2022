const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Student = sequelize.define("Student", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    ime: Sequelize.STRING,
    prezime: Sequelize.STRING,
    index: Sequelize.STRING,
    grupa: Sequelize.STRING,
  });

  return Student;
};