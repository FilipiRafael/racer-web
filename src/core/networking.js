import { keyState } from "./input.js";
import { getCar, carParams } from "../entities/car.js";

const SERVER_URL = "ws://192.168.18.177:8080";
let socket = null;
let connectionStatus = false;
let reconnectTimeout = null;
let connectionCallback = null;

export function initNetworking(onConnectionChange) {
  connectionCallback = onConnectionChange;
  connect();

  setInterval(sendGameState, 100);
}

function connect() {
  if (socket) {
    socket.close();
  }

  socket = new WebSocket(SERVER_URL);

  socket.addEventListener("open", handleOpen);
  socket.addEventListener("message", handleMessage);
  socket.addEventListener("error", handleError);
  socket.addEventListener("close", handleClose);
}

function handleOpen() {
  console.log("WebSocket connection established");
  connectionStatus = true;

  send({
    type: "IDENTIFY",
    clientType: "game",
  });

  if (connectionCallback) {
    connectionCallback(true);
  }
}

function handleMessage(event) {
  try {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);

    if (data.type === "JOYSTICK_UPDATE") {
      handleJoystickUpdate(data.directions);
    }
  } catch (error) {
    console.error("Error parsing message:", error);
  }
}

function handleError(error) {
  console.error("WebSocket error:", error);
}

function handleClose(event) {
  console.log("WebSocket connection closed:", event.code, event.reason);
  connectionStatus = false;

  if (connectionCallback) {
    connectionCallback(false);
  }

  scheduleReconnect();
}

function scheduleReconnect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }

  reconnectTimeout = setTimeout(() => {
    console.log("Attempting to reconnect...");
    connect();
  }, 3000);
}

function send(data) {
  if (connectionStatus && socket) {
    socket.send(JSON.stringify(data));
  }
}

function handleJoystickUpdate(directions) {
  keyState["w"] = directions.includes("up");
  keyState["s"] = directions.includes("down");
  keyState["a"] = directions.includes("left");
  keyState["d"] = directions.includes("right");
}

function sendGameState() {
  if (!connectionStatus || !socket) return;

  const car = getCar();
  if (!car) return;

  send({
    type: "GAME_STATE",
    carState: {
      position: {
        x: car.position.x,
        y: car.position.y,
        z: car.position.z,
      },
      rotation: {
        y: car.rotation.y,
      },
      speed: carParams.speed,
      grounded: carParams.grounded,
    },
    timestamp: Date.now(),
  });
}

export function isConnected() {
  return connectionStatus;
}

export function getConnectionStatus() {
  return connectionStatus;
}
