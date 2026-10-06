import { InputMedia } from '@mtcute/node'

import api from '../api/metalArchiveAPI.ts'
import { formatArtistInfo } from '../utils/formatters.ts'
import { createArtistKeyboard, createLinksKeyboard, createArtistBandsKeyboard } from '../utils/keyboards.ts'
import messages from '../constants/messages.ts'
import userState from '../utils/userState.ts'

import type { TelegramClient } from '@mtcute/node'
import type { CallbackQueryContext } from '@mtcute/dispatcher'
import type { BandArtist } from '../types'

export const sendArtistInfoFromCallback = async (
  callback: CallbackQueryContext,
  bot: TelegramClient,
  artistId: string
) => {
  await callback.answer({ text: messages.ARTIST_LOADING })

  const artist = (await api.getArtistInfo(artistId)) as BandArtist
  const formattedArtistInfo = formatArtistInfo(artist)

  const message = await callback.getMessage()

  userState.set(callback.chat.id, {
    artist,
    lastArtistInfo: formattedArtistInfo
  })

  if (artist.photo_url)
    await bot.replyMedia(message, InputMedia.photo(`${artist.photo_url}`, { caption: formattedArtistInfo }), {
      replyMarkup: createArtistKeyboard(artist)
    })
  else await bot.replyText(message, formattedArtistInfo)
}

export const sendArtistLinksFromCallback = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  try {
    const user = userState.get(callback.chat.id)
    const artistLinks = user.artist.links
    const message = await callback.getMessage()
    await callback.answer({})
    await bot.replyText(message, 'Ссылки', { replyMarkup: createLinksKeyboard(artistLinks) })
  } catch (error) {
    console.error('Error in sendArtistLinksFromCallback:', error)
    await callback.answer({ text: messages.ERROR_GENERIC })
  }
}

export const sendArtistActiveBands = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  try {
    const user = userState.get(callback.chat.id)
    const activeBands = user.artist.active_bands
    const message = await callback.getMessage()
    await callback.answer({})
    await bot.replyText(message, 'Активные группы', { replyMarkup: createArtistBandsKeyboard(activeBands) })
  } catch (error) {
    console.error('Error in sendArtistActiveBands:', error)
    await callback.answer({ text: messages.ERROR_GENERIC })
  }
}

export const sendArtistPastBands = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  try {
    const user = userState.get(callback.chat.id)
    const pastBands = user.artist.past_bands
    const message = await callback.getMessage()
    await callback.answer({})
    await bot.replyText(message, 'Прошлые группы', { replyMarkup: createArtistBandsKeyboard(pastBands) })
  } catch (error) {
    console.error('Error in sendArtistPastBands:', error)
    await callback.answer({ text: messages.ERROR_GENERIC })
  }
}

export const sendArtistGuestBands = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  try {
    const user = userState.get(callback.chat.id)
    const guestSessions = user.artist.guest_session
    const message = await callback.getMessage()
    await callback.answer({})
    await bot.replyText(message, 'Как гость', { replyMarkup: createArtistBandsKeyboard(guestSessions) })
  } catch (error) {
    console.error('Error in sendArtistGuestBands:', error)
    await callback.answer({ text: messages.ERROR_GENERIC })
  }
}
