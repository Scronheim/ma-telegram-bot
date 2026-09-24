import { TelegramClient } from '@mtcute/node'
import { Dispatcher } from '@mtcute/dispatcher'
import { MtProxyTcpTransport } from '@mtcute/node'

import { registerCommands } from './handlers/commandHandler.ts'

const runBot = async () => {
  const botClient = new TelegramClient({
    apiId: Number(process.env.API_ID),
    apiHash: process.env.API_HASH!,
    storage: 'bot.session',
    transport: new MtProxyTcpTransport({
      host: '192.168.0.2',
      port: 2443,
      secret: 'dd0a9a2c4d4dc686ec6803d6aed5881e81'
    })
  })

  await botClient.start({
    botToken: process.env.TELEGRAM_BOT_TOKEN!
  })

  console.log('🤘 Metal Archives bot запущен! 🤘')
  const dispatcher = Dispatcher.for(botClient)
  registerCommands(dispatcher, botClient)
}

runBot()
