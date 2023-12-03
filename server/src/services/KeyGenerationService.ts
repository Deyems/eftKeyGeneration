import crypto, { CipherKey } from 'crypto';

class KeyService{

    /**
     * 
     * @param length 
     * @returns 
     */
    generateSecureHexKey(length: number): string {
        return crypto.randomBytes(length).toString('hex').toUpperCase();
    }

    /**
     * 
     * @param hexKey 
     * @returns 
     */
    calculateXORKCV(hexKey: string): string {
        const keyBuffer = Buffer.from(hexKey, 'hex');
      
        // Take the first and last 8 bytes of the key
        const leftPart = keyBuffer.slice(0, 8);
        const rightPart = keyBuffer.slice(-8);
      
        // XOR the left and right parts
        const xorResult = Buffer.alloc(8);
        for (let i = 0; i < 8; i++) {
          xorResult[i] = leftPart[i] ^ rightPart[i];
        }
      
        // Convert the XOR result to hexadecimal
        const kcvHex = xorResult.toString('hex').toUpperCase();
        return kcvHex;
    }

    /**
     * 
     * @param data 
     * @param dataEncoding 
     * @param key 
     * @param keyEncoding 
     * @param outputEncoding 
     * @returns 
     */
    encrypt3DES(data:string, dataEncoding:BufferEncoding, key:string, keyEncoding:BufferEncoding, outputEncoding:BufferEncoding){
        // algorithm: string, key: crypto.CipherKey, iv: crypto.BinaryLike | null,
        let k = Buffer.from(key, keyEncoding) as CipherKey;
        let cipher = crypto.createCipheriv('des-ede', k , Buffer.alloc(0));
        cipher.setAutoPadding(false);
        let encryptedData = cipher.update(data, dataEncoding,outputEncoding);
        encryptedData += cipher.final(outputEncoding);
        return encryptedData.toUpperCase();
    }
    //to generate the KCV you encrypt the decrypted Key with 16 bytes of Zeroes.

    xorComponentKeys(){

    }

    generateComponentKeys(){
        let componentKey_1 = this.generateSecureHexKey(16);
        let componentKey_2 = this.generateSecureHexKey(16);
        console.log(componentKey_1, 'key_1');
        console.log(componentKey_2, 'key_2');
        //Save it to Redis.
    }
}

// Example usage
const keyService = new KeyService();
// 06a6662ae0cd0cf640923536b54ccc64 = 4634531C5581C092
// 135af03e7c80bb9c836d1e0ecf837e85 = 9037EE30B303C519
// comp1 = 719A8B731738627A7D4B9C0B45F87CEE -> 7BFD2F75DF6F40FD
// comp2 = 6EBA582353E84D8C1AB9040758B4799F => E2011B1984C16CEF

// const secureHexKey = keyService.generateSecureHexKey(16);
const secureHexKey = "6EBA582353E84D8C1AB9040758B4799F";



// console.log(secureHexKey, 'keys generated');
// console.log(keyService.calculateXORKCV(secureHexKey), 'kcv');
console.log(keyService.encrypt3DES("0000000000000000", 'hex', secureHexKey, 'hex', 'hex'), 'new algo kcv');

export default new KeyService();
