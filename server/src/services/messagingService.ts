import RedisServiceHandler from './redisService';
import KeyGenerationService from './keyGenerationService';
import { ENVIRONMENTVARIABLES } from '../config';
const {APP: {KCV_DATA_TO_ENCRYPT}} = ENVIRONMENTVARIABLES;
import LogHelper from '../utils/logHelper';
class MessagingSetup {

  private redisHandler: RedisServiceHandler;
  private keyHandler: KeyGenerationService;

  constructor() {
    this.redisHandler = new RedisServiceHandler();
    this.keyHandler = new KeyGenerationService();
  }

  async subscribeForKey(data: Record<string, string>): Promise<Boolean | Record<string, string>> {
    //Handle errors
    const {terminalId, socketId} = data;
    try {
    // check if tid still has keys? and respond with data from redisHandler.
    const found = await this.redisHandler.findTerminalKey(terminalId);
    if(found){
      return this.buildJsonResponse(JSON.parse(found));
    }
    let keyInformation = this.generateKeys();
    let parsedData = {terminalId, socketId, ...keyInformation};
    
    //Save data to Redis - Redis is used as my storage.
    await this.redisHandler.persistKeyMappedToTerminal(parsedData);

    //Log the data for terminal that keys were generated successfully.
    LogHelper.logTcpRequestDataToFile(terminalId, `${JSON.stringify(this.buildJsonResponse(parsedData))}`);
    return this.buildJsonResponse(parsedData);
    } catch (error:any) {
      //error type can be added later.
      LogHelper.logTcpRequestDataToFile(terminalId, `An error occured trying to fetch keys`);
      return false;
    }
    
  }

  buildJsonResponse(data: Record<string, string>){
    delete data.socketId;
    return {
      curTime: new Date().toISOString(),
      responseCode: "00",
      ...data
    }
  }

  generateKeys(){
    //The generation of keys can be made to be async by using promisify.
    const ctmk = this.keyHandler.generatePlainHexKey();
    const ctsk = this.keyHandler.generatePlainHexKey();
    const ctpk = this.keyHandler.generatePlainHexKey();
    
    const tmk_kcv = this.keyHandler.encrypt3DES(KCV_DATA_TO_ENCRYPT as string, 'hex', ctmk, 'hex', 'hex');
    const tsk_kcv = this.keyHandler.encrypt3DES(KCV_DATA_TO_ENCRYPT as string, 'hex', ctsk, 'hex', 'hex');
    const tpk_kcv = this.keyHandler.encrypt3DES(KCV_DATA_TO_ENCRYPT as string, 'hex', ctpk, 'hex', 'hex');
    
    const ETMK = this.keyHandler.encrypt3DES(ctmk, 'hex', this.keyHandler.xorHexStringComponentKeys(), 'hex', 'hex');
    const ETSK = this.keyHandler.encrypt3DES(ctsk, 'hex', ctmk, 'hex', 'hex');
    const ETPK = this.keyHandler.encrypt3DES(ctpk, 'hex', ctmk, 'hex', 'hex');
    
    return {
      etmk: ETMK,
      tmkKcv: tmk_kcv,
      etsk: ETSK,
      tskKcv: tsk_kcv,
      etpk: ETPK,
      tpkKcv: tpk_kcv
    }
  }

}

export default MessagingSetup;