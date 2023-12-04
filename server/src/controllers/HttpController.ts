import { Request, Response, NextFunction } from "express";
import MessagingHandler from '../services/messagingService';
import { PublishRequestType } from '../interfaces/types';
import LogHelper from "../utils/logHelper";

class HttpController{
    private messagingHandler = new MessagingHandler();
    
    publishKeyHandler = (req: Request, res:Response, next: NextFunction) => {
        const { terminalId, message }: PublishRequestType = req.body;
        LogHelper.logTcpRequestDataToFile(terminalId, message);
        this.messagingHandler.subscribeForKey({ terminalId, data: message });
        res.status(200).json({ success: true });
    }

}

export default new HttpController();