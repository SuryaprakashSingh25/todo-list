const { authJwt } = require("../middleware");
const controller = require("../controllers/note.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Create a task
  app.post(
    "/api/note/createTask",
    [authJwt.verifyToken], controller.createTask
  );

  //List all tasks
  app.get("/api/note/readAllTasks", [authJwt.verifyToken], controller.readAllTasks);

  //List a single task
  app.get(
    "/api/note/readSingleTask/:id",
    [authJwt.verifyToken],controller.readSingleTask
  );

  //Update task by id
  app.put(
    "/api/note/updateTask/:id",
    [authJwt.verifyToken],controller.updateTask
  );

  //Delete task by id
  app.delete(
    "/api/note/deleteTask/:id",
    [authJwt.verifyToken],controller.deleteTask
  );
};