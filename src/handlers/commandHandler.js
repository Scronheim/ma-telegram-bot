import { createMainMenuKeyboard } from '../utils/keyboards.js'
import { sendRandomBand } from '../services/bandService.js'
import messages from '../constants/messages.js'

const handleStart = ctx => {
  ctx.reply(messages.WELCOME, createMainMenuKeyboard())
}

const handleRandom = async ctx => {
  await sendRandomBand(ctx)
}

export const registerCommands = bot => {
  bot.command('start', ctx => handleStart(ctx))
  bot.command('random', ctx => handleRandom(ctx))
}
