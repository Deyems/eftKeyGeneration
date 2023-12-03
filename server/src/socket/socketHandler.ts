import MessagingHandler from '../services/messagingService';
import { PublishRequestType, SubscriptionType } from '../interfaces/types';
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
          
            socket.on('fetch_keys', (data) => {
              console.log(`Socket ${socket.id} subscribed to ${JSON.stringify(data)}`);
              const {terminalId} = data;
              //Generate keys 
              this.messagingHandler.subscribe({terminalId, socketId: socket.id});
              socket.emit('subsribe', "Hello My Guy");
            });
          
            socket.on('deactivate_keys', ({ terminalId }: SubscriptionType) => {
              console.log(`Socket ${socket.id} unsubscribed from room ${terminalId}`);
              this.messagingHandler.unsubscribe(terminalId, socket.id);
            });
          
            socket.on('disconnect', () => {
              console.log(`Socket disconnected: ${socket.id}`);
              // Unsubscribe all channels when a socket disconnects
              this.messagingHandler.unsubscribeAll(socket.id);
            });
        });
        
        ioHandler.on("error", (err) => {
            console.log(err, "error at socket ioHandler");
        });
    }
}


export default new SocketHandler();