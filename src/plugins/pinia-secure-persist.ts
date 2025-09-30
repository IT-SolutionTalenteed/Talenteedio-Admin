// src/plugins/securePersistedState.ts
import { createPersistedState } from 'pinia-plugin-persistedstate';
import SecureLS from 'secure-ls';

const secureLS = new SecureLS({ encodingType: 'aes', isCompression: false });

export function createSecurePersistedState() {
  return createPersistedState({
    storage: {
      getItem: (key: string) => {
        return secureLS.get(key);
      },
      setItem: (key: string, value: string) => {
        secureLS.set(key, value);
      }
    }
  });
}
