const Actions = function (bot) {
    this.sendMessage = (text, { chat: { id }, message_id }) => {
        return bot.sendMessage(id, text, { reply_to_message_id: message_id });
    }

    this.deleteMessage = async (sended = { chat: { id: 0 }, message_id: 0 }, received = { chat: { id: 0 }, message_id: 0 }) => {
        await Promise.all([
            bot.deleteMessage(sended.chat.id, sended.message_id),
            bot.deleteMessage(received.chat.id, received.message_id)
        ]);
    }

    return this;
}

module.exports = Actions;