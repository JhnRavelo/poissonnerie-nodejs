require("dotenv").config({ path: ".env.production" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./databases/models");
const publicPath = path.join(__dirname, "public");

const app = express();

app.use(express.static(publicPath));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const stockRouter = require("./routers/stockRouter");
app.use("/stock", stockRouter);

const achatRouter = require("./routers/achatRouter");
app.use("/achat", achatRouter);

// ⬇️ LA PARTIE MAGIQUE POUR ELECTRON
async function startServer() {
  await db.sequelize.sync();

  return new Promise((resolve) => {
    const PORT = process.env.SERVER_PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}`);
      resolve();
    });
  });
}

module.exports = { startServer };