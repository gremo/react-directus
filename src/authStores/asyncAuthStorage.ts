import { AuthenticationData, AuthenticationStorage } from '@directus/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorageKey } from './settings';

/**
 * Simple AsyncStorage storage implementation for React Native
 *
 * @returns AuthenticationStorage
 */
export const asyncAuthStorage = {
  get: async (): Promise<AuthenticationData | null> => {
    const data = await AsyncStorage.getItem(authStorageKey);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },
  set: async (value: AuthenticationData | null): Promise<void> => {
    if (value) {
      await AsyncStorage.setItem(authStorageKey, JSON.stringify(value));
    } else {
      await AsyncStorage.removeItem(authStorageKey);
    }
  },
} as AuthenticationStorage;
