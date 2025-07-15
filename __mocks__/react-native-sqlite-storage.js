const mockDB = {
    transaction: (cb) => cb({
      executeSql: (sql, params, success, error) => {
        if (typeof success === 'function') {
          success({}, { rows: { length: 0, item: () => null } });
        }
      }
    }),
    executeSql: (sql, params, success, error) => {
      if (typeof success === 'function') {
        success({}, { rows: { length: 0, item: () => null } });
      }
    },
    close: jest.fn(),
  };
  
  module.exports = {
    openDatabase: jest.fn(() => mockDB),
    DEBUG: jest.fn(),
    enablePromise: jest.fn(),
  };