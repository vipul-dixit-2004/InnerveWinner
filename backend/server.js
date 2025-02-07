const WebSocket = require("ws");
const os = require("os");
const messages = [
  {
    id: 1738914867453,
    text: "Hello! Anyone from Bataliyan 23 Srinagar",
    user: "rahul@gmail.com", // Firebase UID
    nickname: "Rahul",
    timestamp: 1738914867453,
    synced: false,
    source: "local",
  },
  {
    id: 1738914867455,
    text: "Well i got posted there in 2015",
    user: "parikshit@gmail.com", // Firebase UID
    nickname: "Gen. Parikshit",
    timestamp: 1738914867455,
    synced: false,
    source: "local",
  },
  {
    text: "⚠️ Your Flight 6E321 is delayed by 1 hour.",
    nickname: "SAARTHI",
    user: "bot@gmail.com",
    id: 1738914867456,
    timestamp: 1738914867456,
    synced: false,
    source: "local",
  },
  {
    id: 1738914867457,
    text: "Looks Like we got lot of time😂",
    user: "parikshit@gmail.com", // Firebase UID
    nickname: "Gen. Parikshit",
    timestamp: 1738914867457,
    synced: false,
    source: "local",
  },
  {
    text: "This is your crew. Have a Safe journey and if need any help call us.",
    nickname: "CREW",
    user: "crew@gmail.com",
    id: 1738914867458,
    timestamp: 1738914867458,
    synced: false,
    source: "local",
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
    text: "Welcome to the SkyLink ChatRoom",
    nickname: "SAARTHI",
    user: "bot@gmail.com",
    id: timestamp,
    timestamp: timestamp,
    synced: true,
    source: "local",
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
