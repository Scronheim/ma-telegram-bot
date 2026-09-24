import { BotKeyboard, InputMedia } from '@mtcute/node'
import { CallbackDataBuilder, type CallbackQueryContext } from '@mtcute/dispatcher'

import api from '../api/metalArchiveAPI.ts'
import { formatAlbumInfo, timeToSeconds } from '../utils/formatters.ts'
import messages from '../constants/messages.ts'
import userState from '../utils/userState.ts'

import type { TelegramClient } from '@mtcute/node'
import type { Album } from '../types'

const MainButton = new CallbackDataBuilder('main', 'action', 'value')

export const sendAlbumInfoFromCallback = async (
  callback: CallbackQueryContext,
  bot: TelegramClient,
  albumId: string
) => {
  await callback.answer({ text: messages.ALBUM_LOADING })

  const album = (await api.getAlbumInfo(albumId)) as Album
  const formattedAlbumInfo = formatAlbumInfo(album)

  const message = await callback.getMessage()

  const keyboard = []
  const tracklistHaveUrls = album.tracklist.some((t) => t.url)
  if (tracklistHaveUrls) {
    keyboard.push([
      BotKeyboard.callback('⬇️ Скачать альбом', MainButton.build({ action: 'downloadAlbum', value: albumId }))
    ])
  }

  userState.set(callback.chat.id, {
    album,
    lastAlbumInfo: formattedAlbumInfo
  })

  if (album.cover_url)
    await bot.replyMedia(
      message,
      InputMedia.photo(`${messages.MA_URL}${album.cover_url}`, { caption: formattedAlbumInfo }),
      { replyMarkup: BotKeyboard.inline(keyboard) }
    )
  else await bot.replyText(message, formattedAlbumInfo)
}

export const downloadAlbum = async (callback: CallbackQueryContext, bot: TelegramClient, albumId: string) => {
  const userStateData = userState.get(callback.chat.id)

  const message = await callback.getMessage()
  const albumMedia = userStateData.album.tracklist.flatMap((t) => {
    return InputMedia.audio(t.url.replace('/music', 'file:/mnt/data/music'), {
      title: t.title,
      duration: timeToSeconds(t.duration) || t.duration
    })
  })
  const MAX_ALBUM_SIZE = 10

  // Разбиваем массив на чанки по 10 элементов
  const chunks: any[][] = []
  for (let i = 0; i < albumMedia.length; i += MAX_ALBUM_SIZE) {
    chunks.push(albumMedia.slice(i, i + MAX_ALBUM_SIZE))
  }

  // Отправляем каждый чанк
  for (const chunk of chunks) {
    if (chunk.length === 1) {
      // Для одного файла используйте sendMedia, так как альбом требует минимум 2
      await bot.replyMedia(message, chunk[0])
    } else {
      await bot.replyMediaGroup(message, chunk)
    }
    // Небольшая пауза, чтобы избежать флуд-лимитов
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}
