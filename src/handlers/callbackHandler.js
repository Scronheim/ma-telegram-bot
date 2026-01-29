import { sendRandomBand, sendBandFromSearch } from '../services/bandService.js'
import { searchBands } from '../services/searchService.js'
import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatAlbumInfo } from '../utils/formatters.js'
import { createMainMenuKeyboard, createBandKeyboard } from '../utils/keyboards.js'
import messages from '../constants/messages.js'

const handleCallback = async (bot, callbackQuery) => {
  const chatId = callbackQuery.message.chat.id
  const data = callbackQuery.data
  const userStateData = userState.get(chatId)

  try {
    if (data === 'random_again') {
      await bot.answerCallbackQuery(callbackQuery.id)
      await sendRandomBand(bot, chatId)
      return
    }

    if (data === 'show_logo') {
      await bot.answerCallbackQuery(callbackQuery.id)
      if (userStateData?.band?.logo_url) {
        await bot.sendPhoto(chatId, userStateData.band.logo_url, {
          caption: `🎨 Логотип ${userStateData.band.name}`
        })
      }
      return
    }

    if (data.startsWith('search_select_')) {
      const bandId = data.replace('search_select_', '')
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: messages.BAND_LOADING
      })
      await sendBandFromSearch(bot, chatId, bandId)
      return
    }

    if (data === 'back_to_search') {
      await bot.answerCallbackQuery(callbackQuery.id)
      if (userStateData.searchResults && userStateData.searchQuery) {
        await searchBands(bot, chatId, userStateData.searchQuery)
      } else {
        bot.sendMessage(chatId, messages.SEARCH_PROMPT)
        userState.set(chatId, { state: 'searching' })
      }
      return
    }

    if (data === 'new_search') {
      await bot.answerCallbackQuery(callbackQuery.id)
      bot.sendMessage(chatId, messages.SEARCH_PROMPT)
      userState.set(chatId, { state: 'searching' })
      return
    }

    if (data === 'main_menu') {
      await bot.answerCallbackQuery(callbackQuery.id)
      userState.delete(chatId)
      await bot.sendMessage(chatId, messages.MAIN_MENU, createMainMenuKeyboard())
      return
    }

    if (data.startsWith('album_')) {
      await handleAlbumCallback(bot, callbackQuery, data, userStateData)
      return
    }

    if (data === 'back_to_band') {
      await handleBackToBand(bot, callbackQuery, userStateData)
      return
    }
  } catch (error) {
    console.error('Error in callback query:', error)
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: 'Произошла ошибка'
    })
  }
}

const handleAlbumCallback = async (bot, callbackQuery, data, userStateData) => {
  const chatId = callbackQuery.message.chat.id
  const albumId = data.replace('album_', '')

  await bot.answerCallbackQuery(callbackQuery.id, {
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
    await bot.sendPhoto(chatId, albumInfo.cover_url, {
      caption: albumMessage,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    })
  } else {
    await bot.sendMessage(chatId, albumMessage, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    })
  }
}

const handleBackToBand = async (bot, callbackQuery, userStateData) => {
  const chatId = callbackQuery.message.chat.id
  await bot.answerCallbackQuery(callbackQuery.id)

  if (userStateData?.lastBandInfo && userStateData?.band) {
    const keyboard = createBandKeyboard(userStateData.band)
    await bot.sendPhoto(chatId, userStateData.band.photo_url, {
      caption: userStateData.lastBandInfo,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  }
}

export const registerCallbackHandler = bot => {
  bot.on('callback_query', query => handleCallback(bot, query))
}
