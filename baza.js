const Sequelize = require("sequelize");
const sequelize = new Sequelize("spirala2", "root", "", {
   host: "127.0.0.1",
   dialect: "mysql",
   pool: {
      max: 1,
      min: 0
    }
});
module.exports = sequelize;