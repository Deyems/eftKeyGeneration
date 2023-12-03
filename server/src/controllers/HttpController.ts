import { Request, Response, NextFunction } from "express";
import MessagingHandler from '../services/messagingService';
import { PublishRequestType } from '../interfaces/types';

class HttpController{
    private messagingHandler = new MessagingHandler();

    publishHandler = (req: Request, res:Response, next: NextFunction) => {
        const { terminalId, message }: PublishRequestType = req.body;
        this.messagingHandler.publishMessage({ terminalId, data: message });
        res.json({ success: true });
    }

    subscribeHandler = (req: Request, res:Response) => {
        const { terminalId, message }: PublishRequestType = req.body;
        this.messagingHandler.publishMessage({ terminalId, data: message });
        res.json({ success: true });
    }
}

export default new HttpController();