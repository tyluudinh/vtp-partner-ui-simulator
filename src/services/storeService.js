const STORE_NAME_KEY = 'appStore';

class StoreService {
  static getStore() {

    const valueStr = localStorage.getItem(STORE_NAME_KEY);

    if (!valueStr) {
      return {};
    }

    try {
      return JSON.parse(valueStr);
    } catch (error) {
      console.error('Error parsing store', error);
      return {};
    }
  }

  static setStore(store) {
    localStorage.setItem(STORE_NAME_KEY, JSON.stringify(store));
  }

  static clearStore() {
    localStorage.removeItem(STORE_NAME_KEY);
  }
}

export default StoreService;