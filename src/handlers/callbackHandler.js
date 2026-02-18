import { sendRandomBand, sendBandFromSearch } from '../services/bandService.js'
import { searchBands } from '../services/searchService.js'
import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatAlbumInfo } from '../utils/formatters.js'
import { createMainMenuKeyboard, createBandKeyboard } from '../utils/keyboards.js'
import messages from '../constants/messages.js'

const handleCallback = async ctx => {
  const chatId = ctx.update.callback_query.message.chat.id
  const callbackQueryId = ctx.update.callback_query.id
  const data = ctx.update.callback_query.data
  const userStateData = userState.get(chatId)

  try {
    if (data === 'random_again') {
      await ctx.answerCbQuery(callbackQueryId)
      await sendRandomBand(ctx, chatId)
      return
    }

    if (data === 'show_logo') {
      await ctx.answerCbQuery(callbackQueryId)
      if (userStateData?.band?.logo_url) {
        await ctx.sendPhoto(chatId, `${messages.MA_URL}${userStateData.band.logo_url}`, {
          caption: `🎨 Логотип ${userStateData.band.name}`
        })
      }
      return
    }

    if (data.startsWith('search_select_')) {
      const bandId = data.replace('search_select_', '')
      await ctx.answerCbQuery(callbackQueryId, {
        text: messages.BAND_LOADING
      })
      await sendBandFromSearch(ctx, chatId, bandId)
      return
    }

    if (data === 'back_to_search') {
      await ctx.answerCbQuery(callbackQueryId)
      if (userStateData.searchResults && userStateData.searchQuery) {
        await searchBands(ctx, chatId, userStateData.searchQuery)
      } else {
        ctx.sendMessage(chatId, messages.SEARCH_PROMPT)
        userState.set(chatId, { state: 'searching' })
      }
      return
    }

    if (data === 'new_search') {
      await ctx.answerCbQuery(callbackQueryId)
      ctx.sendMessage(chatId, messages.SEARCH_PROMPT)
      userState.set(chatId, { state: 'searching' })
      return
    }

    if (data === 'main_menu') {
      await ctx.answerCbQuery(callbackQueryId)
      userState.delete(chatId)
      await ctx.sendMessage(chatId, messages.MAIN_MENU, createMainMenuKeyboard())
      return
    }

    if (data.startsWith('album_')) {
      await handleAlbumCallback(ctx, callbackQueryId, data, userStateData)
      return
    }

    if (data === 'back_to_band') {
      await handleBackToBand(ctx, userStateData)
      return
    }
  } catch (error) {
    console.error('Error in callback query:', error)
    await ctx.answerCbQuery(callbackQueryId, {
      text: 'Произошла ошибка'
    })
  }
}

const handleAlbumCallback = async (ctx, callbackQueryId, data, userStateData) => {
  const albumId = data.replace('album_', '')

  await ctx.answerCbQuery(callbackQueryId, {
    text: messages.ALBUM_LOADING
  })

  const albumInfo = await api.getAlbumInfo(albumId)

  const formattedAlbumInfo = formatAlbumInfo(albumInfo)
  const bandName = userStateData?.band?.name || 'Группа'

  const albumMessage = `
*${bandName}*
${formattedAlbumInfo}
  `.trim()

  const keyboard = [[{ text: '⬅️ Назад к группе', callback_data: 'back_to_band' }]]

  if (userStateData?.currentBandId) {
    keyboard.unshift([
      {
        text: '⬅️ Назад к результатам поиска',
        callback_data: 'back_to_search'
      }
    ])
  }

  if (albumInfo.cover_url) {
    await ctx.replyWithPhoto(`${messages.MA_URL}${albumInfo.cover_url}`, {
      caption: albumMessage,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    })
  } else {
    await ctx.reply(albumMessage, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    })
  }
}

const handleBackToBand = async (ctx, userStateData) => {
  if (userStateData?.lastBandInfo && userStateData?.band) {
    const keyboard = createBandKeyboard(userStateData.band)
    await ctx.replyWithPhoto(`${messages.MA_URL}${userStateData.band.photo_url}`, {
      caption: userStateData.lastBandInfo,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  }
}

export const registerCallbackHandler = ctx => {
  ctx.on('callback_query', ctx => handleCallback(ctx))
}
