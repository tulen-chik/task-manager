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
    // If a key is missing, i18n returns the key itself
    expect(i18n.t('nonexistent_key')).toBe('nonexistent_key');
  });

  // Test fallbackLng behavior when switching to an unsupported language
  it('should use fallbackLng if language is not supported', async () => {
    await i18n.changeLanguage('fr'); // 'fr' is not configured, should fallback to English
    expect(i18n.language).toBe('fr'); // i18n still sets the language
    expect(i18n.t('tasks')).toBe('Tasks'); // But returns English translation
  });

  // Test fallback to English if languageDetector returns an unsupported language
  it('should fallback to en if languageDetector returns unsupported language', async () => {
    await i18n.changeLanguage('de'); // 'de' is not configured, should fallback to English
    expect(i18n.t('tasks')).toBe('Tasks');
  });

  // Ensure all keys in English translation are present in Russian translation
  it('should have all keys in en present in ru', () => {
    const enKeys = Object.keys(en);
    const ruKeys = Object.keys(ru);
    enKeys.forEach(key => {
      expect(ruKeys).toContain(key);
    });
  });

  // Ensure all keys in Russian translation are present in English translation
  it('should have all keys in ru present in en', () => {
    const enKeys = Object.keys(en);
    const ruKeys = Object.keys(ru);
    ruKeys.forEach(key => {
      expect(enKeys).toContain(key);
    });
  });
}); 