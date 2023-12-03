import crypto, { CipherKey } from 'crypto';
import { promisify } from 'util';
import { ENVIRONMENTVARIABLES } from "../config/index";
const {APP} = ENVIRONMENTVARIABLES;

class KeyService{

    private encoding: BufferEncoding = 'hex';
    private keyLen = 16;
    private algorithm = 'des-ede';
    private componentKey_1 = APP.COMPONENT_KEY_1 as string;
    private componentKey_2 = APP.COMPONENT_KEY_1 as string;

    // private randomAsyncBytes = promisify(crypto.randomBytes);

    /**
     * 
     * @param length 
     * @returns 
     */
    generatePlainHexKey(): string {
        return crypto.randomBytes(this.keyLen).toString(this.encoding).toUpperCase();
    }

    /**
     * 
     * @param data 
     * @param dataEncoding 
     * @param key 
     * @param keyEncoding 
     * @param outputEncoding 
     * @returns HEX STRING
     * @description 
     * Can be used to derive KCV for a HexKey with length of 32 characters
     * Can be used to encrypt CTMK, CTSK, CTPK
     * 
     */
    encrypt3DES(data:string, dataEncoding:BufferEncoding, key:string, keyEncoding:BufferEncoding, outputEncoding:BufferEncoding){
        let k = Buffer.from(key, keyEncoding) as CipherKey;
        let encryptedDataArr = [];
        let cipher = crypto.createCipheriv(this.algorithm, k , Buffer.alloc(0));
        cipher.setAutoPadding(false);
        let encryptedData = cipher.update(data, dataEncoding, outputEncoding);
        let finalEncoding = cipher.final(outputEncoding);
        encryptedDataArr.push(encryptedData);
        encryptedDataArr.push(finalEncoding);
        let output = encryptedDataArr.join("").toUpperCase();
        return output;
    }
    //to generate the KCV you encrypt the decrypted Key with 16 bytes of Zeroes.

    /**
     * 
     * @param data 
     * @param _dataEncoding 
     * @param key 
     * @param keyEncoding 
     * @param outputEncoding 
     * @returns 
     */
    decrypt3DES(data:Buffer, _dataEncoding:BufferEncoding, key:string, keyEncoding:BufferEncoding, outputEncoding:BufferEncoding){
        let decryptedDataArr = [];
        let k = Buffer.from(key,keyEncoding as BufferEncoding);
        let decipher = crypto.createDecipheriv(this.algorithm, k , Buffer.alloc(0));
        decipher.setAutoPadding(false);
        let decryptedData = decipher.update(data, undefined, outputEncoding as BufferEncoding);
        let finalEncoding = decipher.final(outputEncoding as BufferEncoding);

        decryptedDataArr.push(decryptedData);
        decryptedDataArr.push(finalEncoding);
        let output = decryptedDataArr.join("").toUpperCase();
        return output;
    }

    /**
     * 
     * @param componentKey_1 
     * @param componentKey_2 
     * @returns 
     */
    xorHexStringComponentKeys(): string {
        let buf1 = Buffer.from(this.componentKey_1, this.encoding);
        let buf2 = Buffer.from(this.componentKey_2, this.encoding);
        let xorCombinedOutput = [];
    
        for (let idx = 0; idx < buf1.length; idx++) {
            let xorValue = buf1[idx] ^ buf2[idx];
            let store = xorValue.toString(16).toString();
            store = store.length == 1 ? `0${store}` : store;
            xorCombinedOutput.push(store);
        }
        return xorCombinedOutput.join("").toUpperCase();
    }

    generateComponentKeys(): Record<string, string>{
        let componentKey_1 = this.generatePlainHexKey();
        let componentKey_2 = this.generatePlainHexKey();
        return {
            componentKey_1,
            componentKey_2
        }
    }

    getEncryptedKey(data: string, key: string){
        return this.encrypt3DES(data, this.encoding, key, this.encoding, this.encoding);
    }

    getDecryptedKey(data: string, key: string){
        this.decrypt3DES(Buffer.from(data), this.encoding, key, this.encoding, this.encoding);
    }
}

export default KeyService;