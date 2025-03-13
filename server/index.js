// const WebSocket = require('ws');

// const server = new WebSocket.Server({ port: 3000 });

// console.log("Connecting");

// server.on('connection', (socket) => {
//     console.log("[ SERVER ][ OUT ]: New connection established.");

//     socket.on('message', (message) => {
//         const data = JSON.parse(message);

//         // Broadcast the message to all clients
//         server.clients.forEach(client => {
//             if (client !== socket && client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify(data));
//             }
//         });
//     });

//     socket.on('close', () => {
//         console.log("[ SERVER ][ OUT ]: A client has disconnected.");
//     });
// });


// const WebSocket = require('ws');
// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// // Create HTTP server
// const server = http.createServer((req, res) => {
//     const filePath = path.join(__dirname, '..', 'client', 'index.html');
//     const content = fs.readFileSync(filePath);
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(content);
// });

// app.use(express.static(path.join(__dirname, '..', 'client')));

// // Attach WebSocket server to the HTTP server
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (socket) => {
//     console.log("[ SERVER ][ OUT ] New connection established.");

//     socket.on('message', (message) => {
//         const data = JSON.parse(message);

//         // Broadcast to all clients except the sender
//         wss.clients.forEach(client => {
//             if (client !== socket && client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify(data));
//             }
//         });
//     });

//     socket.on('close', () => {
//         console.log("[ SERVER ][ OUT ] A client has disconnected.");
//     });
// });

// // Start the server
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`[ SERVER ][ OUT ] Running on http://localhost:${PORT}`);
// });



const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the entire client folder
app.use(express.static(path.join(__dirname, '..', 'client')));

wss.on('connection', (socket) => {
    console.log("[ SERVER ][ OUT ]: New WebSocket connection.");

    socket.on('message', (message) => {
        const data = JSON.parse(message);
        
        // Broadcast to all other clients
        // console.log(`[ SERVER ][ DATA ]: ${JSON.stringify(data)}`);
        wss.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    socket.on('close', () => {
        console.log("[ SERVER ][ OUT ]: Client disconnected.");
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[ SERVER ][ OUT ]: Running on http://localhost:${PORT}`);
});
