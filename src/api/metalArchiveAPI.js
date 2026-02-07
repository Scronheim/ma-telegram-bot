import axios from 'axios'
import config from '../config/config.js'

class MetalArchiveAPI {
  constructor() {
    this.baseURL = config.api.baseURL
  }

  async getRandomBand() {
    try {
      const response = await axios.get(`${this.baseURL}/band/random`)
      return response.data.band_info
    } catch (error) {
      console.error('Error fetching random band:', error.message)
      throw error
    }
  }

  async searchBands(query) {
    try {
      const response = await axios.get(`${this.baseURL}/band/search?field=name&query=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching bands:', error.message)
      throw error
    }
  }

  async getBandById(bandId) {
    try {
      const response = await axios.get(`${this.baseURL}/band/${bandId}`)
      return response.data.band_info
    } catch (error) {
      console.error('Error fetching band by id:', error.message)
      return null
    }
  }

  async getAlbumInfo(albumId) {
    try {
      const response = await axios.get(`${this.baseURL}/album/${albumId}`)
      return response.data.album_info
    } catch (error) {
      console.error('Error fetching album info:', error.message)
      return this._getAlbumStub(albumId)
    }
  }

  _getAlbumStub(albumId) {
    return {
      id: albumId,
      title: 'Album Information',
      message: 'Detailed album information would be available via API',
      year: 'Unknown',
      type: 'Unknown',
      tracklist: []
    }
  }
}

export default new MetalArchiveAPI()
