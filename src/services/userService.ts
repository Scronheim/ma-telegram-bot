import { InputMedia } from '@mtcute/node'

import api from '../api/metalArchiveAPI.ts'
import { formatUserInfo } from '../utils/formatters.ts'
import {
  createUserKeyboard,
  createBandsKeyboard,
  createAlbumsKeyboard,
  createSiteLinkKeyboard
} from '../utils/keyboards.ts'
import messages from '../constants/messages.ts'
import userState from '../utils/userState.ts'

import type { TelegramClient } from '@mtcute/node'
import type { CallbackQueryContext } from '@mtcute/dispatcher'
import type { User, UserState, ShortBand, ShortAlbum } from '../types'

export const sendTelegramUserFromCallback = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  const user = (await api.getTelegramUser(callback.user.id)) as User
  await callback.answer({})
  if (user) {
    userState.set(callback.chat.id, { user })
    await bot.sendText(callback.chat, formatUserInfo(user), { replyMarkup: createUserKeyboard(user) })
  } else await bot.sendText(callback.chat, messages.USER_NOT_FOUND, { replyMarkup: createSiteLinkKeyboard() })
}

export const sendTelegramUserFavBands = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  const userStateData: UserState = userState.get(callback.chat.id)
  const message = await callback.getMessage()
  await callback.answer({})
  await bot.replyText(message, 'Избранные группы', {
    replyMarkup: createBandsKeyboard(userStateData.user?.favorite_bands as ShortBand[])
  })
}

export const sendTelegramUserFavAlbum = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  const userStateData: UserState = userState.get(callback.chat.id)
  const message = await callback.getMessage()
  await callback.answer({})
  await bot.replyText(message, 'Избранные альбомы', {
    replyMarkup: createAlbumsKeyboard(userStateData.user?.favorite_albums as ShortAlbum[])
  })
}
