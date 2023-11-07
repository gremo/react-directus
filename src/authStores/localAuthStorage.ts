import { AuthenticationData, AuthenticationStorage } from '@directus/sdk';
import { authStorageKey } from './settings';

/**
 * Simple memory storage implementation
 *
 * @returns AuthenticationStorage
 */
export const localAuthStorage = {
  get: () => {
    const data = localStorage.getItem(authStorageKey);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },
  set: (value: AuthenticationData | null) => {
    if (value) {
      localStorage.setItem(authStorageKey, JSON.stringify(value));
    } else {
      localStorage.removeItem(authStorageKey);
    }
  },
} as AuthenticationStorage;
