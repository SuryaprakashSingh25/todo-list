module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Singh@123",
    DB: "todolist",
    dialect: "mysql",
    define: {
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };