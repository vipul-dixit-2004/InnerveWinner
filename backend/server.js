const os = require("os");
const WebSocket = require("ws");
const express = require("express");

// Function to get local IP
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let config of interfaces[iface]) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "127.0.0.1"; // Default fallback
};

const IP_ADDRESS = getLocalIP();
console.log(`Server running at: ws://${IP_ADDRESS}:3000`);

const app = express();
const server = app.listen(3000);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(`Echo: ${message}`); // Send back the message
  });

  ws.on("close", () => console.log("Client disconnected"));
});
