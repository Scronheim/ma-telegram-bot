import { InputMedia } from '@mtcute/node'

import api from '../api/metalArchiveAPI.ts'
import userState from '../utils/userState.ts'
import { formatBandInfo } from '../utils/formatters.ts'
import { createBandKeyboard } from '../utils/keyboards.ts'
import messages from '../constants/messages.ts'

import type { TelegramClient } from '@mtcute/node'
import type { CallbackQueryContext, MessageContext } from '@mtcute/dispatcher'
import type { Band } from '../types'

export const sendBandInfo = async (msg: MessageContext, band: Band, isRandom: boolean = true) => {
  const bandInfo = formatBandInfo(band)

  try {
    if (band.photo_url || band.logo_url) {
      const imageUrl = band.photo_url ? band.photo_url : band.logo_url
      await msg.replyMedia(InputMedia.photo(`${messages.MA_URL}${imageUrl}`, { caption: bandInfo }), {
        replyMarkup: createBandKeyboard(band, isRandom)
      })
    } else {
      await msg.replyText(bandInfo)
    }

    userState.set(msg.chat.id, {
      band,
      lastBandInfo: bandInfo
    })
  } catch (error) {
    console.error('Error sending band info:', error)
    // await msg.re(bandInfo, options)
  }
}

export const sendBandInfoFromCallback = async (callback: CallbackQueryContext, bot: TelegramClient, band: Band, isRandom: boolean = true) => {
  const bandInfo = formatBandInfo(band)
  const message = await callback.getMessage()

  try {
    if (band.photo_url || band.logo_url) {
      const imageUrl = band.photo_url ? band.photo_url : band.logo_url
      await bot.replyMedia(message, InputMedia.photo(`${messages.MA_URL}${imageUrl}`, { caption: bandInfo }), {
        replyMarkup: createBandKeyboard(band, isRandom)
      })
    } else {
      await bot.replyText(message, bandInfo)
    }

    userState.set(callback.chat.id, {
      band,
      lastBandInfo: bandInfo
    })
  } catch (error) {
    console.error('Error sending band info:', error)
    await bot.replyText(message, bandInfo)
  }
}

export const sendRandomBandFromCallback = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  try {
    await callback.answer({ text: messages.RANDOM_LOADING })
    const band = await api.getRandomBand()

    await sendBandInfoFromCallback(callback, bot, band, true)
  } catch (error) {
    console.error('Error in sendRandomBand:', error)
    await callback.answer({ text: messages.ERROR_GENERIC })
  }
}

export const sendRandomBand = async (msg: MessageContext) => {
  try {
    await msg.answerText(messages.RANDOM_LOADING, { silent: true })
    const band = await api.getRandomBand()

    await sendBandInfo(msg, band, true)
  } catch (error) {
    console.error('Error in sendRandomBand:', error)
    await msg.answerText(messages.ERROR_GENERIC)
  }
}

export const sendBandbyId = async (callback: CallbackQueryContext, bot: TelegramClient, bandId: string) => {
  try {
    await callback.answer({ text: messages.BAND_LOADING })
    const band = await api.getBandById(bandId)

    if (!band) {
      await callback.answer({ text: messages.ERROR_BAND_LOAD })
      return
    }

    await sendBandInfoFromCallback(callback, bot, band, false)

    userState.update(callback.chat.id, {
      currentBandId: bandId,
      currentBandName: band.name
    })
  } catch (error) {
    console.error('Error loading band from search:', error)
    callback.answer({ text: messages.ERROR_BAND_LOAD })
  }
}
