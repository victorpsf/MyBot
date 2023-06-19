const Hash = require('./lib/Hash')
const Symmetric = require('./lib/Symmetric')

exports.isCommand = ({ text }) => /\//.test(text);
exports.isHashCommand = ({ text }) => /\/HASH/.test(text.toUpperCase());
exports.isEncryptCommand = ({ text }) => /\/ENCRYPT/.test(text.toUpperCase());
exports.isDecryptCommand = ({ text }) => /\/DECRYPT/.test(text.toUpperCase());

exports.commands = `
Utilize os comandos abaixo

/Hash [chiper] [value]
/Encrypt [chiper] [pwd] [value]
/Decrypt [chiper] [pwd] [value]
`;

const handleHash = (cipher, value) => {
    try { return Hash.create(cipher).update(value); }

    catch (error) {
        console.log(`[ERROR] :: ${error}`)
        return `Não conseguir gerar o hash, tente outra cifra ${criptography.hashs.join('\n')}`;
    }
}

const handleEncrypt = (cipher, pwd, value) => {
    try { return Symmetric.create(cipher, pwd).encrypt(value); }
    catch (error) {
        console.log(`[ERROR] :: ${error}`)
        return `Não conseguir encriptar, tente outra cifra ou não informe para pegar a padrão`;
    }
}

const handleDecrypt = (cipher, pwd, value) => {
    try { return Symmetric.create(cipher, pwd).decrypt(value); }
    catch (error) {
        console.log(`[ERROR] :: ${error}`)
        return `Não conseguir encriptar, tente outra cifra ou não informe para pegar a padrão`;
    }
}

exports.handleCommand = async ({ text }) => {
    const [command, cipher, ...values] = text.split(' ');

    if (this.isHashCommand({ text }))
        return (values.length == 1) ? handleHash(cipher, values[0]): handleHash('sha512', cipher);

    if (this.isEncryptCommand({ text }))
        return (values.length == 1) ? handleEncrypt('aes-256-ccm', cipher, values[0]): handleEncrypt(cipher, values[0], values[1]);

    if (this.isDecryptCommand({ text }))
        return (values.length == 1) ? handleDecrypt('aes-256-ccm', cipher, values[0]): handleDecrypt(cipher, values[0], values[1]);
    
    return `
Comando não reconhecido.

${this.commands}
`
}