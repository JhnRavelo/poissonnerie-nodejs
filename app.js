const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./databases/models");
const { exec } = require("child_process");
require("dotenv").config();
const app = express();
const mysql = require("mysql2/promise");

mysql
  .createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
  })
  .then((connection) => {
    connection
      .query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME};`)
      .then(() => {
        db.sequelize.options.logging = false;
        db.sequelize.sync({ alter: true }).then(() => {
          app.listen(process.env.SERVER_PORT, async () => {
            try {
              console.log(`http://localhost:${process.env.SERVER_PORT}`);
              exec(
                "start chrome http://localhost:4000",
                (err, stdout, stderr) => {
                  if (err) {
                    console.error(`Error opening browser: ${err}`);
                    return;
                  }
                  console.log(`stdout: ${stdout}`);
                  console.error(`stderr: ${stderr}`);
                }
              );
            } catch (error) {
              console.log("BUILD", error);
            }
          });
        });
      });
  });

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.static("public/"));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const stockRouter = require("./routers/stockRouter");
app.use("/stock", stockRouter);
const achatRouter = require("./routers/achatRouter");
app.use("/achat", achatRouter);
