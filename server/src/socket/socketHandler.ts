import MessagingHandler from '../services/messagingService';
import { SubscriptionType } from '../interfaces/types';
import { Server } from 'socket.io';
import { DefaultEventsMap } from "@socket.io/component-emitter";
import LogHelper from '../utils/logHelper';

class SocketHandler{

    private messagingHandler = new MessagingHandler();

    handleConnection = (ioHandler: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
        ioHandler.use((socket, next) => {
            //Making the token an apikey for simplicity
            //The token can use a dynamic JWT token, which can be added by
            //Listening for token generation event and this would reply with token with a limited time expiry.
            const {token} = socket.handshake.headers;

            if(!token) {
                socket.emit('message', 'unathorized');
                return;
            }
            next();
        });

        ioHandler.on('connection', (socket) => {
            
            socket.on('fetch_keys', async (data) => {
                const {terminalId} = data;
                LogHelper.logTcpRequestDataToFile(socket.id, `No terminalId key set`);
              
                if(!terminalId){
                    LogHelper.logTcpRequestDataToFile('error', `No terminalId key set`);
                    socket.emit('send_keys', {error: true, data: null});
                    return;
                }
              //Generate keys 
              let response = await this.messagingHandler.subscribeForKey({terminalId, socketId: socket.id});
              //Check if there was error.
                if(!response) {
                    LogHelper.logTcpRequestDataToFile('error', `An error occured trying to fetch keys`);
                    socket.emit('send_keys', {error: true, data: null}) ;
                    //log error
                    return;
                }
                socket.emit('send_keys', response);
                return;
            });
          
            socket.on('deactivate_keys', ({ terminalId }: SubscriptionType) => {
                LogHelper.logTcpRequestDataToFile(terminalId, `SocketID ${socket.id} deactivated Keys`);
            });
          
            socket.on('disconnect', () => {
                //Handle disconnectivity.
                socket._cleanup();
                LogHelper.logTcpRequestDataToFile('disconnect', `SocketID ${socket.id} disconnected`);
            });

            socket.on('error', (err) => {
                //Log error to a file or any other place
                LogHelper.logTcpRequestDataToFile('error', `SocketID ${socket.id} ${JSON.stringify(err)}`);
                socket._cleanup();
            })
        });
        
        ioHandler.on("error", (err) => {
            //Listen for error.
            //Log error to file.
            console.log(err, "error at socket ioHandler");
        });
    }
}


export default new SocketHandler();