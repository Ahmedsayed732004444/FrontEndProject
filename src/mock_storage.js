// src/mock_storage.js
export function SetUpMockLocalStorage() {
  const store = {};
  
  global.localStorage = {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }
  };
  
  // Also mock window if needed (since client.ts checks typeof window !== "undefined")
  global.window = {
    location: {
      href: ''
    }
  };
}
