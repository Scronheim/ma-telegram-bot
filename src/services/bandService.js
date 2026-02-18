import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatBandInfo } from '../utils/formatters.js'
import { createBandKeyboard } from '../utils/keyboards.js'
import messages from '../constants/messages.js'

export const sendBandInfo = async (ctx, band, loadingMsgId = null, isRandom = true) => {
  const chatId = ctx.update.message.chat.id
  const bandInfo = formatBandInfo(band)

  const options = {
    parse_mode: 'Markdown',
    reply_markup: createBandKeyboard(band, isRandom)
  }

  try {
    if (band.photo_url || band.logo_url) {
      const imageUrl = band.photo_url ? band.photo_url : band.logo_url
      await ctx.replyWithPhoto(`${messages.MA_URL}${imageUrl}`, {
        caption: bandInfo,
        ...options
      })
    } else {
      await ctx.reply(bandInfo, options)
    }

    userState.set(chatId, {
      band,
      lastBandInfo: bandInfo
    })
  } catch (error) {
    console.error('Error sending band info:', error)
    await ctx.reply(bandInfo, options)
  }
}

export const sendRandomBand = async ctx => {
  try {
    const loadingMsg = await ctx.reply(messages.RANDOM_LOADING)
    const band = await api.getRandomBand()
    await sendBandInfo(ctx, band, loadingMsg.message_id, true)
  } catch (error) {
    console.error('Error in sendRandomBand:', error)
    ctx.reply(messages.ERROR_GENERIC)
  }
}

export const sendBandFromSearch = async (ctx, bandId) => {
  try {
    const chatId = ctx.update.message.chat.id
    const loadingMsg = await ctx.reply(messages.BAND_LOADING)
    const band = await api.getBandById(bandId)

    if (!band) {
      await ctx.editMessageText(messages.ERROR_BAND_LOAD, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      })
      return
    }

    await sendBandInfo(ctx, chatId, band, loadingMsg.message_id, false)

    userState.update(chatId, {
      currentBandId: bandId,
      currentBandName: band.name
    })
  } catch (error) {
    console.error('Error loading band from search:', error)
    ctx.reply(messages.ERROR_BAND_LOAD)
  }
}
