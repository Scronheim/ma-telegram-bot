import { InputMedia, type TelegramClient } from '@mtcute/node'

import {
  sendRandomBandFromCallback,
  sendBandbyId,
  sendBandLinksFromCallback,
  sendBandCurrentLineupCallback,
  sendBandPastLineupCallback
} from '../services/bandService.ts'
import { sendAlbumInfoFromCallback, downloadAlbum } from '../services/albumService.ts'
import {
  sendArtistInfoFromCallback,
  sendArtistLinksFromCallback,
  sendArtistActiveBands,
  sendArtistPastBands,
  sendArtistGuestBands
} from '../services/artistService.ts'
import userState from '../utils/userState.ts'

import { createBandKeyboard } from '../utils/keyboards.ts'
import messages from '../constants/messages.ts'

import type { CallbackQueryContext } from '@mtcute/dispatcher'

export const handleCallback = async (callback: CallbackQueryContext, bot: TelegramClient) => {
  const data = (callback.dataStr as string).split(':')
  const action = data[1]
  const id = data[2]
  const userStateData = userState.get(callback.chat.id)
  await bot.setTyping({ peerId: callback.chat })

  try {
    if (action === 'getRandomBand') {
      await sendRandomBandFromCallback(callback, bot)
    } else if (action === 'getAlbum') {
      await sendAlbumInfoFromCallback(callback, bot, id)
    } else if (action === 'showLogo') {
      if (userStateData?.band?.logo_url) {
        const message = await callback.getMessage()
        await callback.answer({})
        await bot.replyMedia(
          message,
          InputMedia.photo(`${messages.MA_URL}${userStateData.band.logo_url}`, {
            caption: `Логотип ${userStateData.band.name}`
          })
        )
      }
    } else if (action === 'randomAgain') {
      await sendRandomBandFromCallback(callback, bot)
    } else if (action === 'getBandById') {
      await sendBandbyId(callback, bot, id)
    } else if (action === 'downloadAlbum') {
      await downloadAlbum(callback, bot)
    } else if (action === 'showLinks') {
      await sendBandLinksFromCallback(callback, bot)
    } else if (action === 'showCurrentLineup') {
      await sendBandCurrentLineupCallback(callback, bot)
    } else if (action === 'showPastLineup') {
      await sendBandPastLineupCallback(callback, bot)
    } else if (action === 'showBandMember') {
      await sendArtistInfoFromCallback(callback, bot, id)
    } else if (action === 'getArtistLinks') {
      await sendArtistLinksFromCallback(callback, bot)
    } else if (action === 'getArtistActiveBands') {
      await sendArtistActiveBands(callback, bot)
    } else if (action === 'getArtistPastBands') {
      await sendArtistPastBands(callback, bot)
    } else if (action === 'getArtistGuestBands') {
      await sendArtistGuestBands(callback, bot)
    }
    // if (data.startsWith('search_select_')) {
    //   const bandId = data.replace('search_select_', '')
    //   await ctx.answerCbQuery(callbackQueryId, {
    //     text: messages.BAND_LOADING
    //   })
    //   await sendBandFromSearch(ctx, chatId, bandId)
    //   return
    // }

    // if (data === 'new_search') {
    //   await ctx.answerCbQuery()
    //   ctx.sendMessage(chatId, messages.SEARCH_PROMPT)
    //   userState.set(chatId, { state: 'searching' })
    //   return
    // }

    // if (data === 'main_menu') {
    //   await ctx.answerCbQuery()
    //   userState.delete(chatId)
    //   await ctx.sendMessage(chatId, messages.MAIN_MENU, createMainMenuKeyboard())
    //   return
    // }

    // if (data === 'back_to_band') {
    //   await ctx.answerCbQuery()
    //   await handleBackToBand(ctx, userStateData)
    //   return
    // }
  } catch (error) {
    console.error('Error in callback query:', error)
    await callback.answer({
      text: 'Произошла ошибка'
    })
  }
}

const handleBackToBand = async (ctx, userStateData) => {
  if (userStateData?.lastBandInfo && userStateData?.band) {
    const keyboard = createBandKeyboard(userStateData.band)
    await ctx.replyWithPhoto(`${messages.MA_URL}${userStateData.band.photo_url}`, {
      caption: userStateData.lastBandInfo,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    })
  }
}
