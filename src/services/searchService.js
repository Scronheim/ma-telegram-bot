import api from '../api/metalArchiveAPI.js'
import userState from '../utils/userState.js'
import { formatSearchResults } from '../utils/formatters.js'
import { createSearchResultsKeyboard } from '../utils/keyboards.js'
import { sendBandInfo } from './bandService.js'
import config from '../config/config.js'
import messages from '../constants/messages.js'

export const searchBands = async (ctx, chatId, query) => {
  try {
    if (!query || query.trim().length < config.search.minQueryLength) {
      ctx.reply(messages.MIN_QUERY_LENGTH)
      return
    }

    const loadingMsg = await ctx.reply(messages.SEARCHING(query))
    const searchResult = await api.searchBands(query)

    // Single result - show band directly
    if (searchResult.length === 1) {
      const band = await api.getBandById(searchResult[0].id)
      await sendBandInfo(ctx, band, loadingMsg.message_id, false)
      return
    }

    // No results
    if (!searchResult || searchResult.length === 0) {
      await ctx.editMessageText(messages.NO_RESULTS(query), {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      })
      return
    }

    // Multiple results
    const resultsToShow = searchResult.slice(0, config.search.maxResults)
    const message = formatSearchResults(query, searchResult, resultsToShow)
    const keyboard = createSearchResultsKeyboard(resultsToShow)

    userState.set(chatId, {
      state: 'search_results',
      searchQuery: query,
      searchResults: searchResult,
      displayedResults: resultsToShow
    })

    await ctx.editMessageText(message, {
      chat_id: chatId,
      message_id: loadingMsg.message_id,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  } catch (error) {
    console.error('Search error:', error)
    ctx.sendMessage(chatId, messages.ERROR_SEARCH)
  }
}
