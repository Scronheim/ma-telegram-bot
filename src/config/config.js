export default {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    pollingOptions: {
      polling: true,
      onlyFirstMatch: true,
      baseApiUrl: 'http://127.0.0.1:8081'
    }
  },
  api: {
    baseURL: process.env.API_BASE_URL
  },
  search: {
    minQueryLength: 2,
    maxResults: 10,
    inlineMinLength: 3,
    inlineMaxResults: 9
  }
}
