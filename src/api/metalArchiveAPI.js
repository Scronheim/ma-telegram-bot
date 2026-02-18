import axios from 'axios'
import config from '../config/config.js'

class MetalArchiveAPI {
  constructor() {
    this.baseURL = config.api.baseURL
  }

  async getRandomBand() {
    try {
      const response = await axios.get(`${this.baseURL}/band/random`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching random band:', error.message)
      throw error
    }
  }

  async searchBands(query) {
    try {
      const response = await axios.get(`${this.baseURL}/band/search?query=${encodeURIComponent(query)}`)
      return response.data.data
    } catch (error) {
      console.error('Error searching bands:', error.message)
      throw error
    }
  }

  async getBandById(bandId) {
    try {
      const response = await axios.get(`${this.baseURL}/band/${bandId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching band by id:', error.message)
      return null
    }
  }

  async getAlbumInfo(albumId) {
    try {
      const response = await axios.get(`${this.baseURL}/album/${albumId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching album info:', error.message)
    }
  }
}

export default new MetalArchiveAPI()
