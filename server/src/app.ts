import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from "./routes/routes";
import SocketHandler from './socket/socketHandler'

const app = express();
const server = http.createServer(app);
const io = new Server(server);

SocketHandler.handleConnection(io);

app.use(express.json());
app.use('/api/v1', routes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
