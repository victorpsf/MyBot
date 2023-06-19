const crypto = require('crypto')

class Symmetric {
    constructor(cipher, pwd) {
        this.cipher = cipher;
        this.pwd = pwd;
    }

    static create(cipher, pwd) {
        return new Symmetric(cipher, pwd);
    }

    get info() {
        return crypto.getCipherInfo(this.cipher);
    }

    getIv () {
        return crypto.randomBytes(this.info.ivLength);
    }

    get key () {
        return crypto.scryptSync(this.pwd, 'salt', this.info.keyLength);
    }

    toBuffer(plainText, encoding) {
        return Buffer.from(plainText, encoding)
    }
    
    toArray(cipherBuffer) {
        const bytes = [];
        for (const byte of cipherBuffer) bytes.push(byte);
        return bytes;
    }

    byteLength(plainText) {
        return Buffer.byteLength(plainText)
    }

    concat(...buffers) {
        return Buffer.concat(buffers);
    }

    encrypt(plainText = '') {
        const iv = this.getIv();
        const cipher = crypto.createCipheriv(this.cipher, this.key, iv, { authTagLength: 16 });

        const [ v1, v2, v3 ] = [ cipher.update(plainText, 'utf-8'), cipher.final(), cipher.getAuthTag() ];
        return this.concat(iv, v3, v1, v2).toString('base64');
    }

    decrypt(cipherText = '') {
        const cipherBytes = this.toArray(this.toBuffer(cipherText, 'base64'));
        const [iv, tag, value] = [cipherBytes.slice(0, this.info.ivLength), cipherBytes.slice(this.info.ivLength, this.info.ivLength + 16), cipherBytes.slice(this.info.ivLength + 16)];

        const deCipher = crypto.createDecipheriv(this.cipher, this.key, Buffer.from(iv), { authTagLength: 16 });
        deCipher.setAuthTag(Buffer.from(tag));

        return this.concat(deCipher.update(this.toBuffer(value)), deCipher.final()).toString('utf8')
    }
}

module.exports = Symmetric;