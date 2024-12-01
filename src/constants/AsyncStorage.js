import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save data to AsyncStorage
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to store. Can be an object, array, or primitive type.
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error storing data to AsyncStorage", e);
  }
};

/**
 * Retrieve data from AsyncStorage
 * @param {string} key - The key of the stored value.
 * @returns {Promise<any>} The retrieved value or null if not found.
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      return data; // Verify the structure
    }
  } catch (e) {
    console.error("Error retrieving data from AsyncStorage", e);
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - The key of the value to remove.
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data from AsyncStorage", e);
  }
};

/**
 * Clear all data in AsyncStorage
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error("Error clearing AsyncStorage", e);
  }
};
