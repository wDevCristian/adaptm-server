import express from "express";
import sequelize from "./db.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import router from "./routes/index.js";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";

import "./models/relationships.js";

// import router from "./router.js";
// import fileUpload from "express-fileupload";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./static"));
app.use(fileUpload());
app.use("/api", router);

app.use(errorHandlingMiddleware);

async function startApplication() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // await sequelize.drop();
    app.listen(PORT, () => console.log("Server started on port: " + PORT));
  } catch (error) {
    console.log(error);
  }
}

startApplication();

// TODO:
// event, user, userParticipateEvent, userSaveEvent, eventType implement controllers and services

// Event:
// 1. getAll()
// -- should have a lot of filters(TODO: filters should be defined, also add here the savedEvent query, participate, and organizer),
// -- should send only needed fields of data based on filters
// -- should not forget about eventType filtration

// 2. update() (the event can't be deleted)
// -- implement for the edit user action

// 3. create()
// -- implement eventType creation logic for the create event action

// User:
// 1.update (maybe later if I will have time to realize the user settings)
// 2. getById (maybe later if I will have time to realize the user settings)
