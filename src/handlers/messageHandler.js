import { sendRandomBand } from '../services/bandService.js'
import { searchBands } from '../services/searchService.js'
import userState from '../utils/userState.js'
import messages from '../constants/messages.js'

const handleMessage = async ctx => {
  const chatId = ctx.update.message.chat.id
  const text = ctx.update.message.text

  if (text.startsWith('/')) return

  await searchBands(ctx, chatId, text)
}

export const registerMessageHandler = bot => {
  bot.on('message', ctx => handleMessage(ctx))
}
