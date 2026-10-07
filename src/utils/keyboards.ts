import { BotKeyboard } from '@mtcute/node'
import { CallbackDataBuilder } from '@mtcute/dispatcher'

import type {
  Band,
  SocialLink,
  MemberLineUp,
  BandArtist,
  ShortBand,
  ArtistBand,
  ShortAlbum,
  Album,
  User,
  UserState
} from '../types'

const MainButton = new CallbackDataBuilder('main', 'action', 'value')

export const createMainMenuKeyboard = BotKeyboard.inline([
  [BotKeyboard.callback('Случайная группа', MainButton.build({ action: 'getRandomBand', value: '' }))],
  [BotKeyboard.callback('Профиль', MainButton.build({ action: 'getUserProfile', value: '' }))]
])

export const createBandKeyboard = (band: Band, isRandom: boolean = true) => {
  const albums = band.discography?.slice(0, 30) ?? []

  // Формируем ряды альбомов (по 2 в ряд)
  const albumRows: ReturnType<typeof BotKeyboard.callback>[][] = []

  for (let i = 0; i < albums.length; i += 2) {
    const row = [
      BotKeyboard.callback(
        `${albums[i].release_date} - ${albums[i].title} (${albums[i].type})`,
        MainButton.build({ action: 'getAlbumById', value: albums[i].id.toString() })
      )
    ]
    if (i + 1 < albums.length) {
      row.push(
        BotKeyboard.callback(
          `${albums[i + 1].release_date} - ${albums[i + 1].title} (${albums[i + 1].type})`,
          MainButton.build({ action: 'getAlbumById', value: albums[i + 1].id.toString() })
        )
      )
    }
    albumRows.push(row)
  }

  // Отдельный ряд с кнопкой показа логотипа
  const logoButtons = []
  if (band.logo_url) {
    logoButtons.push(BotKeyboard.callback('📷 Показать логотип', MainButton.build({ action: 'showLogo', value: '' })))
  }

  // Отдельный ряд с кнопкой для ссылок
  const linksButtons = []
  if (band.links.length) {
    linksButtons.push(BotKeyboard.callback('🔗 Показать ссылки', MainButton.build({ action: 'showLinks', value: '' })))
  }

  // Отдельный ряд с кнопками состава
  const middleButtons = []

  if (band.current_lineup.length) {
    middleButtons.push(
      BotKeyboard.callback('🎶 Текущий состав', MainButton.build({ action: 'showCurrentLineup', value: '' }))
    )
  }
  if (band.past_lineup.length) {
    middleButtons.push(
      BotKeyboard.callback('🎶 Прошлый состав', MainButton.build({ action: 'showPastLineup', value: '' }))
    )
  }

  // Нижний ряд
  const bottonButtons = []

  if (isRandom) {
    bottonButtons.push(
      BotKeyboard.callback('🔄 Новая случайная группа', MainButton.build({ action: 'randomAgain', value: '' }))
    )
  }

  const allRows = [...albumRows]
  if (logoButtons.length > 0) {
    allRows.push(logoButtons)
  }
  if (middleButtons.length > 0) {
    allRows.push(middleButtons)
  }
  if (bottonButtons.length > 0) {
    allRows.push(bottonButtons)
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

export const createAlbumKeyboard = (userStateData: UserState) => {
  const rows = [
    [BotKeyboard.callback('⬅️ Назад к результатам поиска', MainButton.build({ action: 'backToSearch', value: '' }))]
  ]

  if (userStateData.band?.id) {
    rows.unshift([BotKeyboard.callback('⬅️ Назад к группе', MainButton.build({ action: 'backToBand', value: '' }))])
  }

  return BotKeyboard.inline(rows)
}

export const createUserKeyboard = (user: User) => {
  const rows = []
  const someFavBandsAreNull = user.favorite_bands.some((b) => b.id === null)
  const someFavAlbumsAreNull = user.favorite_albums.some((a) => a.id === null)
  if (!someFavBandsAreNull)
    rows.push([
      BotKeyboard.callback('❤️ Избранные группы', MainButton.build({ action: 'showUserFavoriteBands', value: '' }))
    ])
  if (!someFavAlbumsAreNull)
    rows.push([
      BotKeyboard.callback('❤️ Избранные альбомы', MainButton.build({ action: 'showUserFavoriteAlbums', value: '' }))
    ])

  return BotKeyboard.inline(rows)
}

export const createLinksKeyboard = (links: SocialLink[]) => {
  const socialLinkRows: ReturnType<typeof BotKeyboard.url>[][] = []

  for (let i = 0; i < links.length; i += 2) {
    const row = [BotKeyboard.url(links[i].social, links[i].url)]
    if (i + 1 < links.length) {
      row.push(BotKeyboard.url(links[i + 1].social, links[i + 1].url))
    }
    socialLinkRows.push(row)
  }
  return BotKeyboard.inline(socialLinkRows)
}

export const createSiteLinkKeyboard = () => {
  return BotKeyboard.inline([[BotKeyboard.url('www.metal-archives.ru', 'https://www.metal-archives.ru')]])
}

export const createBandsKeyboard = (bands: ShortBand[] | ArtistBand[]) => {
  const rows = bands.map((band, index) => {
    if (band.id) {
      return [
        BotKeyboard.callback(
          `${index + 1}. ${band.name}`,
          MainButton.build({ action: 'getBandById', value: band.id?.toString() || '' })
        )
      ]
    } else {
      return [BotKeyboard.disabled(`${index + 1}. ${band.name}`, { style: { bgDanger: true } })]
    }
  })
  return BotKeyboard.inline(rows)
}

export const createAlbumsKeyboard = (albums: ShortAlbum[] | Album[]) => {
  const rows = albums.map((album, index) => {
    if (album.id) {
      return [
        BotKeyboard.callback(
          `${index + 1}. ${album.band_names.join(', ')} - ${album.title}`,
          MainButton.build({ action: 'getAlbumById', value: album.id?.toString() || '' })
        )
      ]
    } else {
      return [BotKeyboard.disabled(`${index + 1}. ${album.title}`, { style: { bgDanger: true } })]
    }
  })
  return BotKeyboard.inline(rows)
}

export const createArtistKeyboard = (artist: BandArtist) => {
  const rows = []
  if (artist.active_bands.length) {
    rows.push([
      BotKeyboard.callback('Активные группы', MainButton.build({ action: 'getArtistActiveBands', value: '' }))
    ])
  }
  if (artist.past_bands.length) {
    rows.push([BotKeyboard.callback('Прошлые группы', MainButton.build({ action: 'getArtistPastBands', value: '' }))])
  }
  if (artist.live.length) {
    rows.push([BotKeyboard.callback('Live', MainButton.build({ action: 'getArtistLiveBands', value: '' }))])
  }
  if (artist.guest_session.length) {
    rows.push([BotKeyboard.callback('Как гость', MainButton.build({ action: 'getArtistGuestBands', value: '' }))])
  }
  if (artist.links.length) {
    rows.push([BotKeyboard.callback('Ссылки', MainButton.build({ action: 'getArtistLinks', value: '' }))])
  }

  return BotKeyboard.inline(rows)
}

export const createLineupKeyboard = (lineup: MemberLineUp[]) => {
  const lineupRows: ReturnType<typeof BotKeyboard.callback>[][] = []

  for (let i = 0; i < lineup.length; i += 2) {
    const row = [
      BotKeyboard.callback(
        `${lineup[i].fullname} (${lineup[i].role})`,
        MainButton.build({ action: 'showBandMember', value: lineup[i].id.toString() })
      )
    ]
    if (i + 1 < lineup.length) {
      row.push(
        BotKeyboard.callback(
          `${lineup[i + 1].fullname} (${lineup[i + 1].role})`,
          MainButton.build({ action: 'showBandMember', value: lineup[i + 1].id.toString() })
        )
      )
    }
    lineupRows.push(row)
  }
  return BotKeyboard.inline(lineupRows)
}
