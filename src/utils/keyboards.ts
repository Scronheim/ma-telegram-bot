import { BotKeyboard } from '@mtcute/node'
import { CallbackDataBuilder } from '@mtcute/dispatcher'

import type { Band } from '../types'

const MainButton = new CallbackDataBuilder('main', 'action', 'value')

export const createMainMenuKeyboard = BotKeyboard.inline([
  [BotKeyboard.callback('Случайная группа', MainButton.build({ action: 'getRandomBand', value: '' }))]
])

export const createBandKeyboard = (band: Band, isRandom: boolean = true) => {
  const albums = band.discography?.slice(0, 30) ?? []

  // Формируем ряды альбомов (по 2 в ряд)
  const albumRows: ReturnType<typeof BotKeyboard.callback>[][] = []

  for (let i = 0; i < albums.length; i += 2) {
    const row = [
      BotKeyboard.callback(
        `${albums[i].release_date} - ${albums[i].title} (${albums[i].type})`,
        MainButton.build({ action: 'getAlbum', value: albums[i].id.toString() })
      )
    ]
    if (i + 1 < albums.length) {
      row.push(
        BotKeyboard.callback(
          `${albums[i + 1].release_date} - ${albums[i + 1].title} (${albums[i + 1].type})`,
          MainButton.build({ action: 'getAlbum', value: albums[i + 1].id.toString() })
        )
      )
    }
    albumRows.push(row)
  }

  // Нижний ряд с кнопками действий
  const actionButtons = []
  if (band.logo_url) {
    actionButtons.push(BotKeyboard.callback('📷 Показать логотип', MainButton.build({ action: 'showLogo', value: '' })))
  }
  if (isRandom) {
    actionButtons.push(
      BotKeyboard.callback('🔄 Новая случайная группа', MainButton.build({ action: 'randomAgain', value: '' }))
    )
  }

  const allRows = [...albumRows]
  if (actionButtons.length > 0) {
    allRows.push(actionButtons)
  }

  return BotKeyboard.inline(allRows)
}

export const createSearchResultsKeyboard = (results: Band[]) => {
  // Каждая группа — отдельная строка с одной кнопкой
  const rows = results.map((band, index) => [
    BotKeyboard.callback(
      `${index + 1}. ${band.name} (${band.country}) - ${band.genres}`,
      MainButton.build({ action: 'getBandById', value: band.id.toString() })
    )
  ])

  // Нижний ряд с двумя кнопками
  rows.push([
    BotKeyboard.callback('🔄 Новый поиск', MainButton.build({ action: 'newSearch', value: '' })),
    BotKeyboard.callback('🏠 Главное меню', MainButton.build({ action: 'mainMenu', value: '' }))
  ])

  return BotKeyboard.inline(rows)
}

export const createAlbumKeyboard = (userStateData) => {
  const rows = [
    [BotKeyboard.callback('⬅️ Назад к результатам поиска', MainButton.build({ action: 'backToSearch', value: '' }))]
  ]

  if (userStateData?.band.id) {
    rows.unshift([BotKeyboard.callback('⬅️ Назад к группе', MainButton.build({ action: 'backToBand', value: '' }))])
  }

  return BotKeyboard.inline(rows)
}

export const createColumnKeyboard = (buttons, columns = 2) => {
  const inline_keyboard = []
  for (let i = 0; i < buttons.length; i += columns) {
    inline_keyboard.push(buttons.slice(i, i + columns))
  }
  return { inline_keyboard }
}
