export const formatBandInfo = band => {
  const currentLineup = band.current_lineup?.map(l => `${l.fullname} - ${l.role}`).join('\n') || ''
  return `
🎸 *${band.name}* 🎸

*Страна:* ${band.country || 'Не указана'}
*Город:* ${band.city || 'Не указано'}
*Жанр:* ${band.genres || 'Не указан'}
*Статус:* ${band.status || 'Не указан'}
*Тематика текстов:* ${band.themes || 'Не указана'}
*Основана в:* ${band.formed_in || 'Не указано'}
*Годы активности:* ${band.years_active || 'Не указаны'}
*Лейбл:* ${band.label || 'Не указан'}

*Состав:*
${currentLineup || 'Не указан'}
  `.trim()
}

export const formatSearchResult = (band, index) => {
  return `${index + 1}. *${band.name}* (${band.country}) - ${band.genre}`
}

export const formatAlbumInfo = album => {
  const tracklist = album.tracklist?.map(track => `${track.number}. ${track.title} (${track.duration})`).join('\n') || ''

  return `
💿 *${album.title}* 💿

*Дата релиза:* ${album.release_date || 'Не указан'}
*Тип:* ${album.type || 'Не указан'}
*Треклист:*
${tracklist}
  `.trim()
}

export const formatSearchResults = (query, searchResult, resultsToShow) => {
  let message = `🎸 *Результаты поиска для "${query}"*\n\n`
  message += `Найдено групп: *${searchResult.length}*\n`

  if (searchResult.length > resultsToShow.length) {
    message += `\n_Показано ${resultsToShow.length} из ${searchResult.length} результатов. Уточните запрос для более точного поиска._`
  }

  return message
}
