import i18n from './index'; // Import the i18n instance configured for the app
import en from './en.json'; // Import English translations as a plain object
import ru from './ru.json'; // Import Russian translations as a plain object

// Group all i18n localization tests in a single describe block
describe('i18n localization', () => {
  // Initialize i18n before running any tests
  beforeAll(async () => {
    await i18n.init();
  });

  // Test that English translations are returned by default
  it('should return English translation by default', () => {
    expect(i18n.t('tasks')).toBe('Tasks');
    expect(i18n.t('add_task')).toBe('Add Task');
    expect(i18n.t('status_in_progress')).toBe('In Progress');
  });

  // Test switching to Russian and getting Russian translations
  it('should switch to Russian and return Russian translation', async () => {
    await i18n.changeLanguage('ru');
    expect(i18n.t('tasks')).toBe('Задачи');
    expect(i18n.t('add_task')).toBe('Добавить задачу');
    expect(i18n.t('status_in_progress')).toBe('В процессе');
  });

  // Test switching back to English and getting English translations
  it('should switch back to English', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('tasks')).toBe('Tasks');
    expect(i18n.t('add_task')).toBe('Add Task');
    expect(i18n.t('status_in_progress')).toBe('In Progress');
  });

  // Test fallback behavior for missing translation keys
  it('should fallback to English for missing key', () => {
    expect(i18n.t('nonexistent_key')).toBe('nonexistent_key');
  });

  // Test fallbackLng behavior when switching to an unsupported language
  it('should use fallbackLng if language is not supported', async () => {
    await i18n.changeLanguage('fr');
    expect(i18n.language).toBe('fr');
    expect(i18n.t('tasks')).toBe('Tasks');
  });

  // Test fallback to English if languageDetector returns an unsupported language
  it('should fallback to en if languageDetector returns unsupported language', async () => {
    await i18n.changeLanguage('de');
    expect(i18n.t('tasks')).toBe('Tasks');
  });
}); 