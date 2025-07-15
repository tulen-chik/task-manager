module.exports = {
    getLocales: () => [{ countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false }],
    findBestAvailableLanguage: () => ({ languageTag: 'en', isRTL: false }),
    getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
    getCalendar: () => 'gregorian',
    getCountry: () => 'US',
    getCurrencies: () => ['USD'],
    getTemperatureUnit: () => 'celsius',
    getTimeZone: () => 'America/New_York',
    uses24HourClock: () => true,
    usesMetricSystem: () => true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };