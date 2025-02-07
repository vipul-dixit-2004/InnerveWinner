// const os = require("os");
// const WebSocket = require("ws");
// const express = require("express");

// // Function to get local IP
// const getLocalIP = () => {
//   const interfaces = os.networkInterfaces();
//   for (let iface in interfaces) {
//     for (let config of interfaces[iface]) {
//       if (config.family === "IPv4" && !config.internal) {
//         return config.address;
//       }
//     }
//   }
//   return "127.0.0.1"; // Default fallback
// };

// const IP_ADDRESS = getLocalIP();
// console.log(`Server running at: ws://${IP_ADDRESS}:3000`);

// const app = express();
// const server = app.listen(3000);
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   console.log("New client connected");

//   ws.on("message", (message) => {
//     console.log("Received:", message, ws.data);
//     ws.send(`Echo: ${message} ${ws}`); // Send back the message
//   });

//   ws.on("close", () => console.log("Client disconnected"));
// });

const WebSocket = require("ws");
const os = require("os");
const messages = [];
// Function to get the local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let config of interfaces[iface]) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "127.0.0.1";
};

const IP_ADDRESS = getLocalIP(); // Get local IP address
const PORT = 3000;
const wss = new WebSocket.Server({ host: IP_ADDRESS, port: PORT });

console.log(`WebSocket server running at ws://${IP_ADDRESS}:${PORT}`);

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("A new client connected!");
  clients.add(ws);

  // Notify the new client
  ws.send(Array.toString(messages));

  // Handle incoming messages
  ws.on("message", (message) => {
    const received = JSON.parse(message);
    console.log(`Received: ${received.text} By: ${received.user}`);
    console.log(`${message}`);
    messages.push(received);
    console.log(messages);

    // Broadcast the message to all clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("A client disconnected");
    clients.delete(ws);
  });
});
