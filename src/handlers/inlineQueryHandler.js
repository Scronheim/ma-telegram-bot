import api from '../api/metalArchiveAPI.js'
import config from '../config/config.js'

const handleInlineQuery = async (bot, msg) => {
  const inlineQueryId = msg.id
  const query = msg.query

  if (!query) {
    await bot.answerInlineQuery(inlineQueryId, [])
    return
  }

  if (query.length < config.search.inlineMinLength) {
    await bot.answerInlineQuery(
      inlineQueryId,
      [
        {
          type: 'article',
          id: '1',
          title: 'Ошибка',
          input_message_content: { message_text: '' },
          description: 'Введите больше символов'
        }
      ],
      {
        cache_time: 300,
        is_personal: true,
        next_offset: ''
      }
    )
    return
  }

  try {
    const bands = await api.searchBands(query)
    const results = bands.results.slice(0, config.search.inlineMaxResults).map((band, index) => ({
      type: 'article',
      id: index.toString(),
      input_message_content: { message_text: band.name },
      title: band.name,
      description: `${band.country} - ${band.genre}`
    }))

    await bot.answerInlineQuery(inlineQueryId, results, {
      cache_time: 300,
      is_personal: true,
      next_offset: ''
    })
  } catch (error) {
    console.error('Error answering inline query:', error)
  }
}

export const registerInlineQueryHandler = bot => {
  bot.on('inline_query', msg => handleInlineQuery(bot, msg))
}
