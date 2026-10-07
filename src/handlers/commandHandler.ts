import { filters } from '@mtcute/dispatcher'

import { sendRandomBand } from '../services/bandService.ts'
import { searchBands } from '../services/searchService.ts'
import { handleCallback } from '../handlers/callbackHandler.ts'
import { createMainMenuKeyboard } from '../utils/keyboards.ts'

import messages from '../constants/messages.ts'

import type { TelegramClient } from '@mtcute/node'
import type { Dispatcher, MessageContext, CallbackQueryContext } from '@mtcute/dispatcher'

const handleStart = (msg: MessageContext) => {
  msg.replyText(messages.WELCOME, { replyMarkup: createMainMenuKeyboard })
}

const handleMessage = async (msg: MessageContext) => await searchBands(msg)

const handleRandom = async (msg: MessageContext) => await sendRandomBand(msg)

export const registerCommands = (dispatcher: Dispatcher, bot: TelegramClient) => {
  dispatcher.onNewMessage(filters.command('start'), (msg: MessageContext) => handleStart(msg))
  dispatcher.onNewMessage(filters.command('random'), async (msg: MessageContext) => await handleRandom(msg))
  dispatcher.onNewMessage(async (msg: MessageContext) => await handleMessage(msg))
  dispatcher.onCallbackQuery(async (callback: CallbackQueryContext) => await handleCallback(callback, bot))
}
