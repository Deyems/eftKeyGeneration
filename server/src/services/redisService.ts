
import redis, { Redis } from "ioredis";

class RedisServiceHandler{
    private redis: Redis = new redis();

    persistKeyMappedToTerminal(data: Record<string, string>){
        console.log(data, 'data checker');
        return this.redis.pipeline()
        .set(data.terminalId, JSON.stringify(data))
        .expire(data.terminalId, 60*10)
        .exec();
    }

    findTerminalKey(terminal: string){
        return this.redis.get(terminal);
    }


}

export default RedisServiceHandler;