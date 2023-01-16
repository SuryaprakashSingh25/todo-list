const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const dotenv=require("dotenv");


dotenv.config(".env");
const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: "verification",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

// database
const db = require("./app/models");
const Note = db.note;

db.sequelize.sync({force:false}).then(()=>{
  console.log("Re-sync Done")
})


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TODO." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/note.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
