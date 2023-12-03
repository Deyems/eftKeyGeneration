import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from "./routes/routes";
import SocketHandler from './socket/socketHandler'
import { ENVIRONMENTVARIABLES } from './config';
const {APP} = ENVIRONMENTVARIABLES;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

SocketHandler.handleConnection(io);

app.use(express.json());
app.use('/api/v1', routes);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const port = APP.PORT;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
