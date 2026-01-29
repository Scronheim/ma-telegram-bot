import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatBandInfo } from '../utils/formatters.js'
import { createBandKeyboard } from '../utils/keyboards.js'
import messages from '../constants/messages.js'

export const sendBandInfo = async (bot, chatId, band, loadingMsgId = null, isRandom = true) => {
  const bandInfo = formatBandInfo(band)

  const options = {
    parse_mode: 'Markdown',
    reply_markup: createBandKeyboard(band, isRandom)
  }

  try {
    if (band.photo_url || band.logo_url) {
      const imageUrl = band.photo_url ? band.photo_url : band.logo_url
      await bot.sendPhoto(chatId, imageUrl, {
        caption: bandInfo,
        ...options
      })
    } else {
      await bot.sendMessage(chatId, bandInfo, options)
    }

    userState.set(chatId, {
      band,
      lastBandInfo: bandInfo
    })

    if (loadingMsgId) {
      await bot.deleteMessage(chatId, loadingMsgId)
    }
  } catch (error) {
    console.error('Error sending band info:', error)
    await bot.sendMessage(chatId, bandInfo, options)
  }
}

export const sendRandomBand = async (bot, chatId) => {
  try {
    const loadingMsg = await bot.sendMessage(chatId, messages.RANDOM_LOADING)
    const band = await api.getRandomBand()
    await sendBandInfo(bot, chatId, band, loadingMsg.message_id, true)
  } catch (error) {
    console.error('Error in sendRandomBand:', error)
    bot.sendMessage(chatId, messages.ERROR_GENERIC)
  }
}

export const sendBandFromSearch = async (bot, chatId, bandId) => {
  try {
    const loadingMsg = await bot.sendMessage(chatId, messages.BAND_LOADING)
    const band = await api.getBandById(bandId)

    if (!band) {
      await bot.editMessageText(messages.ERROR_BAND_LOAD, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      })
      return
    }

    await sendBandInfo(bot, chatId, band, loadingMsg.message_id, false)

    userState.update(chatId, {
      currentBandId: bandId,
      currentBandName: band.name
    })
  } catch (error) {
    console.error('Error loading band from search:', error)
    bot.sendMessage(chatId, messages.ERROR_BAND_LOAD)
  }
}
