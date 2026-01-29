export default {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN',
    pollingOptions: {
      polling: true,
      onlyFirstMatch: true
    }
  },
  api: {
    baseURL: process.env.API_BASE_URL || 'https://api.metal-archives.com'
  },
  search: {
    minQueryLength: 2,
    maxResults: 10,
    inlineMinLength: 3,
    inlineMaxResults: 9
  }
}
