const crypto = require('crypto')

class Hash {
    constructor(cipher) {
        this.cipher = cipher;
    }

    get ciphers () {
        return crypto.getHashes();
    }

    update(value) {
        if (!this.ciphers.find((a) => a.toUpperCase() === this.cipher.toUpperCase()))
            throw new Error(`[ERROR] Undefined hash cipher: '${this.cipher}'`);

        return crypto.createHash(this.cipher).update(value).digest('base64');
    }

    static create(cipher) {
        return new Hash(cipher);
    }
}

module.exports = Hash;