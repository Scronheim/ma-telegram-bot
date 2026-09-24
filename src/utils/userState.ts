class UserStateManager {
  constructor() {
    this.states = new Map()
  }

  get(chatId) {
    return this.states.get(chatId) || {}
  }

  set(chatId, state) {
    this.states.set(chatId, { ...this.get(chatId), ...state })
  }

  update(chatId, updates) {
    this.set(chatId, updates)
  }

  delete(chatId) {
    this.states.delete(chatId)
  }

  clear() {
    this.states.clear()
  }
}

export default new UserStateManager()
