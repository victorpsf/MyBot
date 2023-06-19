require('dotenv').config();
const process = require('process')
const BotModule = require('node-telegram-bot-api')
const bot = new BotModule(process.env.TOKEN, { polling: true });
const Actions = require('./actions')
const { commands, isCommand, handleCommand } = require('./commands')
const actions = new Actions(bot);

bot.on('message', async (message) => {
    if (!isCommand(message)) {
        actions.sendMessage(commands, message);
        return;
    }

    const result = await handleCommand(message);
    actions.sendMessage(`Resultado: \n\n${result}`, message)
        .then((sended) => {
            setTimeout(() => {
                actions.deleteMessage(sended, message);
            }, 20000);
        });
});