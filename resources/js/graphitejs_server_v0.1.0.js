import express from "express";
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";

/**
 * A WebSocket-based server for handling real-time communication.
 * Supports broadcasting, private messaging, and room-based communication.
 */
class Server {
  /**
   * Initializes a new WebSocket server.
   * @param {number} [port=3000] - The port number the server should listen on.
   */
  constructor(port = 3000) {
    /** @type {number} The port number for the server. */
    this.port = port;

    /** @type {Set<WebSocket>} A set of all connected clients. */
    this.clients = new Set();

    /** @type {Map<string, Set<WebSocket>>} A map of room names to sets of clients. */
    this.rooms = new Map();

    this.initServer();
    this.initWebSocket();
  }

  /**
   * Initializes the HTTP server using Express.
   */
  initServer() {
    this.app = express();
    this.server = createServer(this.app);

    // Simple HTTP endpoint to confirm the server is running.
    this.app.get("/", (req, res) => {
      res.send("WebSocket Server is Running!");
    });
  }

  /**
   * Initializes the WebSocket server and sets up event listeners.
   */
  initWebSocket() {
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on("connection", (socket) => this.handleConnection(socket));
  }

  /**
   * Handles new WebSocket client connections.
   * @param {WebSocket} socket - The newly connected client socket.
   */
  handleConnection(socket) {
    console.log("[ SERVER ][ OUT ]: New client connected.");
    this.clients.add(socket);

    socket.on("message", (message) => this.handleMessage(socket, message));
    socket.on("close", () => this.handleDisconnect(socket));
    socket.on("error", (err) => console.error("[ SERVER ][ ERR ]:", err));
  }

  /**
   * Processes incoming WebSocket messages.
   * @param {WebSocket} socket - The client socket that sent the message.
   * @param {string} message - The incoming message data (JSON format).
   */
  handleMessage(socket, message) {
    try {
      const data = JSON.parse(message);
      const { type, payload } = data;

      switch (type) {
        case "broadcast":
          this.broadcast(payload, socket);
          break;

        case "joinRoom":
          this.joinRoom(socket, payload.room);
          break;

        case "leaveRoom":
          this.leaveRoom(socket, payload.room);
          break;

        case "sendToRoom":
          this.sendToRoom(payload.room, payload.message, socket);
          break;

        default:
          console.warn("[ SERVER ][ WARN ]: Unknown event type:", type);
      }
    } catch (error) {
      console.error("[ SERVER ][ ERR ]: Invalid message format.");
    }
  }

  /**
   * Broadcasts a message to all connected clients except the sender.
   * @param {any} message - The message to broadcast.
   * @param {WebSocket} sender - The client sending the message.
   */
  broadcast(message, sender) {
    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "broadcast", message }));
      }
    });
  }

  /**
   * Adds a client to a specific chat room.
   * @param {WebSocket} socket - The client joining the room.
   * @param {string} roomName - The name of the room to join.
   */
  joinRoom(socket, roomName) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(socket);
    console.log(`[ SERVER ][ ROOM ]: Client joined room "${roomName}".`);
  }

  /**
   * Removes a client from a specific chat room.
   * @param {WebSocket} socket - The client leaving the room.
   * @param {string} roomName - The name of the room to leave.
   */
  leaveRoom(socket, roomName) {
    if (this.rooms.has(roomName)) {
      this.rooms.get(roomName).delete(socket);
      console.log(`[ SERVER ][ ROOM ]: Client left room "${roomName}".`);
    }
  }

  /**
   * Sends a message to all clients in a specific room.
   * @param {string} roomName - The name of the room.
   * @param {any} message - The message to send.
   * @param {WebSocket} sender - The client sending the message.
   */
  sendToRoom(roomName, message, sender) {
    if (!this.rooms.has(roomName)) return;

    this.rooms.get(roomName).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "roomMessage", room: roomName, message }));
      }
    });
  }

  /**
   * Handles client disconnections.
   * @param {WebSocket} socket - The client that disconnected.
   */
  handleDisconnect(socket) {
    console.log("[ SERVER ][ OUT ]: Client disconnected.");
    this.clients.delete(socket);

    // Remove socket from all rooms
    this.rooms.forEach((clients, room) => {
      clients.delete(socket);
      if (clients.size === 0) {
        this.rooms.delete(room);
      }
    });
  }

  /**
   * Starts the server and begins listening for connections.
   */
  start() {
    this.server.listen(this.port, () => {
      console.log(`[ SERVER ][ OUT ]: Running on http://localhost:${this.port}`);
    });
  }
}

// Initialize and start the WebSocket Server
const webSocketServer = new Server(3000);
webSocketServer.start();

