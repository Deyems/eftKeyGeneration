export interface MessageType {
    terminalId: string;
    data: any;
}
  
export interface SubscriptionType {
    terminalId: string;
    socketId: string;
}
  
export interface PublishRequestType {
    terminalId: string;
    message: any;
}