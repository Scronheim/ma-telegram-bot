import { sendRandomBand } from '../services/bandService.js'
import { searchBands } from '../services/searchService.js'
import userState from '../utils/userState.js'
import messages from '../constants/messages.js'

const handleMessage = async (bot, msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  if (text.startsWith('/')) return

  switch (text) {
    case '🎲 Случайная группа':
      await sendRandomBand(bot, chatId)
      break
    case '🔍 Поиск группы':
      bot.sendMessage(chatId, messages.SEARCH_PROMPT)
      userState.set(chatId, { state: 'searching' })
      break
    default:
      await searchBands(bot, chatId, text)
      break
  }
}

export const registerMessageHandler = bot => {
  bot.on('message', msg => handleMessage(bot, msg))
}
