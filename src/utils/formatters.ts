import { md } from '@mtcute/markdown-parser'

import type { Band, Album } from '../types'

export const formatBandInfo = (band: Band) => {
  const currentLineup = band.current_lineup?.map((l) => `${l.fullname} - ${l.role}`).join('\n') || ''
  return md(
    `
🎸 **${band.name}** 🎸

**Страна:** ${band.country || 'Не указана'}
**Город:** ${band.city || 'Не указано'}
**Жанр:** ${band.genres || 'Не указан'}
**Статус:** ${band.status || 'Не указан'}
**Тематика текстов:** ${band.themes || 'Не указана'}
**Основана в:** ${band.formed_in || 'Не указано'}
**Годы активности:** ${band.years_active || 'Не указаны'}
**Лейбл:** ${band.label || 'Не указан'}

**Состав:**
${currentLineup || 'Не указан'}
  `.trim()
  )
}

export const formatSearchResult = (band: Band, index: number) => {
  return md(`${index + 1}. **${band.name}** (${band.country}) - ${band.genres}`)
}

export const formatAlbumInfo = (album: Album) => {
  const tracklist =
    album.tracklist?.map((track) => `${track.number}. ${track.title} (${track.duration})`).join('\n') || ''

  return md(
    `
   **${album.band_names.join(', ')}**
💿 **${album.title}** 💿

**Дата релиза:** ${album.release_date || 'Не указан'}
**Тип:** ${album.type || 'Не указан'}
**Треклист:**
${tracklist}
  `.trim()
  )
}

export const formatSearchResults = (query: string, searchResult: Band[], resultsToShow: Band[]) => {
  let message = `🎸 **Результаты поиска для "${query}"**\n\n`
  message += `Найдено групп: **${searchResult.length}**\n`

  if (searchResult.length > resultsToShow.length) {
    message += `\n__Показано ${resultsToShow.length} из ${searchResult.length} результатов. Уточните запрос для более точного поиска.__`
  }

  return md(message)
}

export const timeToSeconds = (time: string): number | null => {
  const parts = time.split(':').map((p) => Number(p))

  // Проверяем, что все части — числа и их 2 или 3
  if (parts.some((p) => Number.isNaN(p)) || (parts.length !== 2 && parts.length !== 3)) {
    return null
  }

  // Если две части — это MM:SS, если три — HH:MM:SS
  const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, parts[0], parts[1]]

  return hours * 3600 + minutes * 60 + seconds
}
