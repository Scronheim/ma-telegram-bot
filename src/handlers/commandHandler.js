import { message } from 'telegraf/filters'
import { createMainMenuKeyboard } from '../utils/keyboards.js'
import { sendRandomBand } from '../services/bandService.js'
import userState from '../utils/userState.js'
import messages from '../constants/messages.js'

const handleStart = ctx => {
  ctx.reply(messages.WELCOME, createMainMenuKeyboard())
}

const handleRandom = async ctx => {
  await sendRandomBand(ctx)
}

const handleSearch = ctx => {
  ctx.reply(messages.SEARCH_PROMPT)
  userState.set(chatId, { state: 'searching' })
}

export const registerCommands = bot => {
  bot.command('start', ctx => handleStart(ctx))
  bot.command('random', ctx => handleRandom(ctx))
  bot.command('search', ctx => handleSearch(ctx))
}
