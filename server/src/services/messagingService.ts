import Redis from 'ioredis';
import { MessageType, SubscriptionType } from '../interfaces/types';

class MessagingSetup {
  private redis: Redis;
  private subscriptions: SubscriptionType[] = [];

  constructor() {
    this.redis = new Redis();
    
    this.redis.on('message', (terminalId, data) => {
      console.log('redis got a message!');
      this.handleMessage({ terminalId, data });
    });
  }

  subscribe(data: Record<string, string>): void {
    const {terminalId, socketId} = data;
    this.redis.subscribe(terminalId);
    this.subscriptions.push({ terminalId, socketId });
    console.log('got to sub in redis');
  }

  generateKeys(terminalId: string){
    //Use UUID to generate Your keys
  }

  unsubscribe(terminalId: string, socketId: string): void {
    this.redis.unsubscribe(terminalId);
    this.subscriptions = this.subscriptions.filter(
      (sub) => !(sub.terminalId === terminalId && sub.socketId === socketId)
    );
  }

  unsubscribeAll(channel: string){
    this.redis.unsubscribe(channel);
    this.subscriptions = [];
  }

  publishMessage({channel, data}: Record<string, any>){
    this.redis.publish(channel, data);
  }

  private handleMessage({ terminalId, data }: MessageType): void {
    const subscribers = this.subscriptions.filter((sub) => sub.terminalId == terminalId);

    for (const { socketId } of subscribers) {
      // You would typically use a more advanced real-time communication library here
      // (e.g., socket.io) to emit the message to the specified socket.
      console.log(`Sending message to socket ${socketId}:`, data);
    }
  }
}

export default MessagingSetup;