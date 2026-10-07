export default {
  WELCOME: '🎸 Добро пожаловать в Metal Archives Bot! 🎸\n\nВыберите действие или просто отправьте название группы:',
  SEARCH_PROMPT: 'Введите название группы для поиска:',
  SEARCHING: (query: string) => `🔍 Ищу группы по запросу: "${query}"...`,
  RANDOM_LOADING: '🎲 Выбираю случайную группу...',
  BAND_LOADING: '🔄 Загружаю информацию о группе...',
  ALBUM_LOADING: 'Загружаю информацию об альбоме...',
  ARTIST_LOADING: 'Загружаю информацию о участнике...',
  ERROR_GENERIC: '❌ Произошла ошибка. Попробуйте еще раз.',
  ERROR_SEARCH: '❌ Произошла ошибка при поиске. Попробуйте еще раз.',
  ERROR_BAND_LOAD: '❌ Не удалось загрузить информацию о группе.',
  BAND_ID_NOT_FOUND: '❌ У группы не указан ID',
  USER_NOT_FOUND:
    '❌ Пользователь не найден. Зарегистрируйтесь/авторизуйтесь на сайте и привяжите учётную запись Telegram в профиле',
  NO_RESULTS: (query: string) => `По запросу "${query}" ничего не найдено.`,
  MIN_QUERY_LENGTH: 'Введите минимум 2 символа для поиска.',
  MAIN_MENU: '🏠 Главное меню:',
  MA_URL: 'https://www.metal-archives.com',
  MA_RU_URL: 'https://www.metal-archives.ru'
}
