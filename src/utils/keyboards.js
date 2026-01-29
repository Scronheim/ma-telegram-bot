export const createMainMenuKeyboard = () => ({
  reply_markup: {
    keyboard: [['🎲 Случайная группа'], ['🔍 Поиск группы']],
    resize_keyboard: true,
    one_time_keyboard: false
  }
})

export const createBandKeyboard = (band, isRandom = true) => {
  const albumButtons =
    band.discography?.reduce((rows, album, index) => {
      if (index % 2 === 0) rows.push([])
      rows[rows.length - 1].push({
        text: `${album.release_date} - ${album.title} (${album.type})`,
        callback_data: `album_${album.id}`
      })
      return rows
    }, []) || []

  const buttons = []
  if (band.logo_url) buttons.push({ text: '📷 Показать логотип', callback_data: 'show_logo' })
  if (isRandom) buttons.push({ text: '🔄 Новая случайная группа', callback_data: 'random_again' })

  return {
    inline_keyboard: [...albumButtons, buttons]
  }
}

export const createSearchResultsKeyboard = results => {
  const buttons = results.map((band, index) => [
    {
      text: `${index + 1}. ${band.name} (${band.country}) - ${band.genre}`,
      callback_data: `search_select_${band.id}`
    }
  ])

  buttons.push([
    { text: '🔄 Новый поиск', callback_data: 'new_search' },
    { text: '🏠 Главное меню', callback_data: 'main_menu' }
  ])

  return { inline_keyboard: buttons }
}

export const createColumnKeyboard = (buttons, columns = 2) => {
  const inline_keyboard = []
  for (let i = 0; i < buttons.length; i += columns) {
    inline_keyboard.push(buttons.slice(i, i + columns))
  }
  return { inline_keyboard }
}
