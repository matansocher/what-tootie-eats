const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true });
const { get: _get } = require('lodash');
const tootieService = require('../tootie.service');
const { WELCOME_MESSAGES } = require('../config');

bot.onText(/\/start/, async (message, match) => {
    const { chatId } = getMessageData(message);
    await bot.sendMessage(chatId, WELCOME_MESSAGES[0]);
    for (let i = 1; i < WELCOME_MESSAGES.length; i++) {
        if (i !== WELCOME_MESSAGES.length) {
            await bot.sendChatAction(chatId, 'typing');
            await sleep(5000);
        }
        await bot.sendMessage(chatId, WELCOME_MESSAGES[i]);
    }
});

const sleep = async (millis) => new Promise(resolve => setTimeout(resolve, millis));

bot.on('message', async (msg) => {
    if (msg.text === '/start') {
        return;
    }
    await messageMainHandler(msg);
});

async function messageMainHandler(message) {
    const { chatId, firstName, lastName, text: messageText } = getMessageData(message);

    const logBody = `chatId: ${chatId}, firstname: ${firstName}, lastname: ${lastName} asked for: ${messageText}`;
    // console.log(`${logBody} - start`);

    try {
        const noNoFoodsArr = tootieService.findTootieNoNoFoods(messageText);
        const message = tootieService.createResponseMessage(noNoFoodsArr);

        // await bot.sendChatAction(chatId, 'typing');
        // await sleep(5000);

        await bot.sendMessage(chatId, message);
        //
        // console.log(`${logBody} - success`);
    } catch (err) {
        console.error(`${logBody} - error - ${JSON.stringify(err)}`);
        await bot.sendMessage(chatId, `Sorry, but something went wrong`);
    }
}

function getMessageData(message) {
    return {
        chatId: _get(message, 'chat.id', ''),
        text: _get(message, 'text', '').toLowerCase(),
        date: _get(message, 'date', ''),
        firstName: _get(message, 'chat.first_name', ''),
        lastName: _get(message, 'chat.last_name', ''),
    };
}
