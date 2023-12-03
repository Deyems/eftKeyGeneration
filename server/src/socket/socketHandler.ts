import MessagingHandler from '../services/messagingService';
import { SubscriptionType } from '../interfaces/types';
import { Server } from 'socket.io';
import { DefaultEventsMap } from "@socket.io/component-emitter";

class SocketHandler{

    private messagingHandler = new MessagingHandler();

    handleConnection = (ioHandler: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
        ioHandler.use((socket, next) => {
            const {token} = socket.handshake.headers;

            if(!token) {
                socket.emit('message', 'unathorized');
                return;
            }
            next();
        });

        ioHandler.on('connection', (socket) => {
            console.log(`new Terminal connected: ${socket.id}`);
          
            socket.on('fetch_keys', async (data) => {
              console.log(`Socket ${socket.id} subscribed to ${JSON.stringify(data)}`);
              const {terminalId} = data;
              if(!terminalId){
                socket.emit('send_keys', {error: true, data: null});
                return;
              }
              //Generate keys 
              let response = await this.messagingHandler.subscribeForKey({terminalId, socketId: socket.id});
              socket.emit('send_keys', response);
              return;
            });
          
            socket.on('deactivate_keys', ({ terminalId }: SubscriptionType) => {
              console.log(`Socket ${socket.id} unsubscribed from room ${terminalId}`);
            });
          
            socket.on('disconnect', () => {
              console.log(`Socket disconnected: ${socket.id}`);
              socket._cleanup();
            });
        });
        
        ioHandler.on("error", (err) => {
            console.log(err, "error at socket ioHandler");
        });
    }
}


export default new SocketHandler();