import { createMainMenuKeyboard } from '../utils/keyboards.js'
import { sendRandomBand } from '../services/bandService.js'
import userState from '../utils/userState.js'
import messages from '../constants/messages.js'

const handleStart = (bot, msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, messages.WELCOME, createMainMenuKeyboard())
}

const handleRandom = async (bot, msg) => {
  await sendRandomBand(bot, msg.chat.id)
}

const handleSearch = (bot, msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, messages.SEARCH_PROMPT)
  userState.set(chatId, { state: 'searching' })
}

export const registerCommands = bot => {
  bot.onText(/\/start/, msg => handleStart(bot, msg))
  bot.onText(/\/random/, msg => handleRandom(bot, msg))
  bot.onText(/\/search/, msg => handleSearch(bot, msg))
}
