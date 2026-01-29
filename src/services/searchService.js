import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatSearchResults } from '../utils/formatters.js'
import { createSearchResultsKeyboard } from '../utils/keyboards.js'
import { sendBandInfo } from './bandService.js'
import config from '../config/config.js'
import messages from '../constants/messages.js'

export const searchBands = async (bot, chatId, query) => {
  try {
    if (!query || query.trim().length < config.search.minQueryLength) {
      bot.sendMessage(chatId, messages.MIN_QUERY_LENGTH)
      return
    }

    const loadingMsg = await bot.sendMessage(chatId, messages.SEARCHING(query))
    const searchResult = await api.searchBands(query)

    // Single result - show band directly
    if (searchResult.bands.length === 1) {
      const band = await api.getBandById(searchResult.bands[0].id)
      await sendBandInfo(bot, chatId, band, loadingMsg.message_id)
      return
    }

    // No results
    if (!searchResult.bands || searchResult.bands.length === 0) {
      await bot.editMessageText(messages.NO_RESULTS(query), {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      })
      return
    }

    // Multiple results
    const resultsToShow = searchResult.bands.slice(0, config.search.maxResults)
    const message = formatSearchResults(query, searchResult, resultsToShow)
    const keyboard = createSearchResultsKeyboard(resultsToShow)

    userState.set(chatId, {
      state: 'search_results',
      searchQuery: query,
      searchResults: searchResult.bands,
      displayedResults: resultsToShow
    })

    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  } catch (error) {
    console.error('Search error:', error)
    bot.sendMessage(chatId, messages.ERROR_SEARCH)
  }
}
