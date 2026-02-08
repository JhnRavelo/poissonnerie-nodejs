require("dotenv").config({ path: ".env.production" });
const { app, BrowserWindow } = require("electron");
const { startServer } = require("./app");

console.log("Electron starting...");

async function createWindow() {
  console.log("Waiting server...");
  await startServer();
  console.log("Server started!");

  const PORT = process.env.SERVER_PORT || 3000;

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + "/icon.ico",
  });

  console.log("Loading URL...");
  win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(createWindow);