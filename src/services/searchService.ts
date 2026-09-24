import api from '../api/metalArchiveAPI.ts'
import userState from '../utils/userState.ts'
import { formatSearchResults } from '../utils/formatters.ts'
import { createSearchResultsKeyboard } from '../utils/keyboards.ts'
import { sendBandInfo } from './bandService.ts'
import config from '../config/config.ts'
import messages from '../constants/messages.ts'

import type { MessageContext } from '@mtcute/dispatcher'
import type { Band } from '../types'

export const searchBands = async (msg: MessageContext) => {
  const bandName = msg.text
  try {
    if (!bandName || bandName.trim().length < config.search.minQueryLength) {
      msg.replyText(messages.MIN_QUERY_LENGTH)
      return
    }

    await msg.replyText(messages.SEARCHING(bandName))
    const searchResult = await api.searchBands(bandName)

    // Single result - show band directly
    if (searchResult.length === 1) {
      const band = (await api.getBandById(searchResult[0].id)) as Band
      await sendBandInfo(msg, band, false)
      return
    }

    // No results
    if (!searchResult || searchResult.length === 0) {
      await msg.edit({ text: messages.NO_RESULTS(bandName) })
      return
    }

    // Multiple results
    const resultsToShow = searchResult.slice(0, config.search.maxResults)
    const message = formatSearchResults(bandName, searchResult, resultsToShow)
    const keyboard = createSearchResultsKeyboard(resultsToShow)

    userState.set(msg.chat.id, {
      state: 'search_results',
      searchQuery: bandName,
      searchResults: searchResult,
      displayedResults: resultsToShow
    })

    await msg.replyText(message, {
      replyMarkup: keyboard
    })
  } catch (error) {
    console.error('Search error:', error)
    msg.edit({ text: messages.ERROR_SEARCH })
  }
}
