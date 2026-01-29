import TelegramBot from 'node-telegram-bot-api'
import config from './config/config.js'
import { registerCommands } from './handlers/commandHandler.js'
import { registerMessageHandler } from './handlers/messageHandler.js'
import { registerCallbackHandler } from './handlers/callbackHandler.js'
import { registerInlineQueryHandler } from './handlers/inlineQueryHandler.js'

const bot = new TelegramBot(config.telegram.token, config.telegram.pollingOptions)

// Register all handlers
registerCommands(bot)
registerMessageHandler(bot)
registerCallbackHandler(bot)
registerInlineQueryHandler(bot)

// Error handling
bot.on('polling_error', error => {
  console.error('Polling error:', error)
})

console.log('🤘 Metal Archives Bot запущен! 🤘')
