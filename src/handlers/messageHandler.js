import { sendRandomBand } from '../services/bandService.js'
import { searchBands } from '../services/searchService.js'

const handleMessage = async ctx => {
  const chatId = ctx.update.message.chat.id
  const text = ctx.update.message.text

  if (text.startsWith('/')) return
  switch (text) {
    case '🎲 Случайная группа':
      await sendRandomBand(ctx, chatId)
      break
    default:
      await searchBands(ctx, chatId, text)
      break
  }
}

export const registerMessageHandler = bot => {
  bot.on('message', ctx => handleMessage(ctx))
}
