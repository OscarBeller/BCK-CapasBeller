import express from "express";
import path from "path";
import __dirname, { SECRET } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import { router as productRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as sessionsRouter } from "./routes/sessionsRouter.js";
import mongoose from "mongoose";
import sessions from "express-session";
import { messagesModel } from "./dao/models/messagesModel.js";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passportConfig.js";
import passport from "passport";

const PORT = 8081;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  sessions({
    secret: SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl:
        "mongodb+srv://VictorMolinaDev:RZWqwmlecNKIu8AE@clustercoder.pdrvouq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCoder",
      dbName: "Ecommerce",
    }),
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

a
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () =>
  console.log(`Server listening in port:${PORT}`)
);

export const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("connectionServer", (connectionMessage) => {
    console.log(connectionMessage);
  });
  socket.on("id", async (userName) => {
    let messages = await messagesModel.find();
    socket.emit("previousMessages", messages);
    socket.broadcast.emit("newUser", userName);
  });
  socket.on("newMessage", async (userName, message) => {
    await messagesModel.create({ user: userName, message: message });
    io.emit("sendMessage", userName, message);
  });
});

const connDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://oscarbeller:oscar@cluster0.egp1hae.mongodb.net/",
      {
        dbName: "Ecommerce",
      }
    );
    console.log("Mongoose online");
  } catch (error) {
    console.log("Error DB", error.message);
  }
};

connDB();
