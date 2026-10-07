import axios from 'axios'
import config from '../config/config.ts'

import type { Album, Band, BandArtist, User } from '../types'

class MetalArchiveAPI {
  baseURL: string
  constructor() {
    this.baseURL = config.api.baseURL || ''
  }

  async getRandomBand(): Promise<Band> {
    try {
      const response = await axios.get(`${this.baseURL}/band/random`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching random band:', error.message)
      throw error
    }
  }

  async searchBands(query: string): Promise<Band[]> {
    try {
      const response = await axios.get(`${this.baseURL}/band/search?query=${encodeURIComponent(query)}`)
      return response.data.data
    } catch (error) {
      console.error('Error searching bands:', error.message)
      throw error
    }
  }

  async getBandById(bandId: string): Promise<Band | null> {
    try {
      const response = await axios.get(`${this.baseURL}/band/${bandId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching band by id:', error.message)
      return null
    }
  }

  async getAlbumInfo(albumId: string): Promise<Album | null> {
    try {
      const response = await axios.get(`${this.baseURL}/album/${albumId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching album info:', error.message)
      return null
    }
  }

  async getArtistInfo(memberId: string): Promise<BandArtist | null> {
    try {
      const response = await axios.get(`${this.baseURL}/artist/${memberId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching member info:', error.message)
      return null
    }
  }

  async getTelegramUser(userId: number): Promise<User | null> {
    try {
      const response = await axios.get(`${this.baseURL}/auth/telegram/${userId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching telegram user info:', error.message)
      return null
    }
  }
}

export default new MetalArchiveAPI()
