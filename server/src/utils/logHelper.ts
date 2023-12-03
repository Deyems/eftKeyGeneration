import FileLogger from "simple-node-logger";
import fs from "fs";
import path from "path";

class LogHelper{

    logTcpRequestDataToFile(identifier: string, msg:string) {
        let enable = process.env.file_log;
        // if(enable != "true")return;
        
        let filesPath = path.join(
          __dirname,
          "..",
          `logs`,
          identifier + `-logfile.log`
        );
        let pathDir = path.dirname(filesPath);
        if (fs.existsSync(pathDir) == false) {
          fs.mkdirSync(pathDir);
        }
    
        let logger = FileLogger.createSimpleLogger({
          logFilePath: filesPath,
          timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        });
    
        logger.log("info", msg);
      }
}

export default LogHelper;