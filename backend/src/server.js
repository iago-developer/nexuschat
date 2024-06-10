const { WebSocketServer } = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", ws => {
    ws.on("error", console.error);

    ws.on("message", data => {
        wss.clients.forEach(client => {
            const dados = JSON.parse(data);

            console.log(`${dados.userName}: ${dados.userContent}.`);
            client.send(data.toString());
        });
    });

    console.log("Client conected!");
});
