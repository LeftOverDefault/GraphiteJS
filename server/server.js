const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the entire client folder
// app.use(express.static(path.join(__dirname, "..", "client")));

wss.on("connection", (socket) => {
    console.log("[ SERVER ][ OUT ]: New WebSocket connection.");

    socket.on("message", (message) => {
        const data = JSON.parse(message);
        
        // Broadcast to all other clients
        wss.clients.forEach(client => {
            // Broadcast to all clients except sender.
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }

            // Broadcast to all clients.
            if (client.readyState === WebSocket.OPEN) {

            }
        });
    });

    socket.on("close", () => {
        console.log("[ SERVER ][ OUT ]: Client Disconnected.");
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[ SERVER ][ OUT ]: Running on http://localhost:${PORT}`);
});
