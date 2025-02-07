const WebSocket = require("ws");
const os = require("os");
const { stringify } = require("querystring");
const messages = [
  {
    text: "Hello! Anyone from Bataliyan 23 Srinagar",
    user: "Cap. Tejas",
    id: 1738914867454,
    timestamp: 1738914867454,
    profileImg: "../assets/profileImages/user.jpg",
  },
  {
    text: "Well i got posted there in 2015",
    user: "Gen. Parikshit",
    id: 1738914867455,
    timestamp: 1738914867455,
    profileImg: "../assets/profileImages/user.jpg",
  },
  {
    text: "⚠️ Your Flight 6E321 is delayed by 1 hour.",
    user: "SAARTHI",
    id: 1738914867456,
    timestamp: 1738914867456,
    profileImg: "../assets/profileImages/bot.jpg", // SAARTHI image
  },
  {
    text: "Looks Like we got lot of time😂",
    user: "Gen. Parikshit",
    id: 1738914867457,
    timestamp: 1738914867457,
    profileImg: "../assets/profileImages/user.jpg",
  },
  {
    text: "This is your crew. Have a Safe journey and if need any help call us.",
    user: "CREW",
    id: 1738914867458,
    timestamp: 1738914867458,
    profileImg: "../assets/profileImages/crew.jpg",
  },
];
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
  const timestamp = Date.now();
  const welcomeMessage = {
    text: "Welcome to the SkyLink",
    user: "SAARTHI",
    id: timestamp,
    timestamp: timestamp,
    profileImg: "../assets/profileImages/bot.jpg",
  };

  if (messages.length) {
    messages.forEach((msg) => {
      const strMsg = JSON.stringify(msg);
      ws.send(strMsg);
    });
  }
  ws.send(JSON.stringify(welcomeMessage));

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
