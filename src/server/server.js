const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });

const clients = new Map();
let nextClientId = 1;

server.on("connection", (socket) => {
  const clientId = nextClientId++;
  const clientType = "unknown";
  clients.set(socket, { id: clientId, type: clientType });

  console.log(`Client ${clientId} connected`);

  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "IDENTIFY") {
        const client = clients.get(socket);
        client.type = data.clientType;
        console.log(`Client ${client.id} identified as ${client.type}`);

        socket.send(
          JSON.stringify({
            type: "CONNECTED",
            clientId: client.id,
          })
        );

        broadcastStatus();
        return;
      }

      const client = clients.get(socket);

      if (data.type === "JOYSTICK_UPDATE") {
        broadcastToGame(data);
        return;
      }

      if (data.type === "GAME_STATE") {
        broadcastToControllers(data);
        return;
      }

      console.log(`Message from ${client.type} (${client.id}):`, data);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  socket.on("close", () => {
    const client = clients.get(socket);
    console.log(`Client ${client.id} (${client.type}) disconnected`);
    clients.delete(socket);
    broadcastStatus();
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
    try {
      clients.delete(socket);
    } catch (e) {
      console.error("Error deleting client:", e);
    }
  });

  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to racing game server",
    })
  );
});

function broadcastStatus() {
  const status = {
    type: "STATUS",
    controllers: 0,
    games: 0,
  };

  clients.forEach((client) => {
    if (client.type === "controller") status.controllers++;
    if (client.type === "game") status.games++;
  });

  broadcast({
    type: "STATUS_UPDATE",
    status,
  });
}

function broadcastToGame(data) {
  clients.forEach((client, socket) => {
    if (client.type === "game" && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  });
}

function broadcastToControllers(data) {
  clients.forEach((client, socket) => {
    if (client.type === "controller" && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  });
}

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client, socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

console.log(`WebSocket server started on port ${PORT}`);
