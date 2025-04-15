import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

export const storage = {
  // Save tokens
  async saveTokens(accessToken: string, refreshToken: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY.ACCESS, accessToken);
      await SecureStore.setItemAsync(TOKEN_KEY.REFRESH, refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  // Get tokens
  async getTokens() {
    try {
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY.ACCESS);
      const refreshToken = await SecureStore.getItemAsync(TOKEN_KEY.REFRESH);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  },

  // Clear tokens (on logout)
  async clearTokens() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY.ACCESS);
      await SecureStore.deleteItemAsync(TOKEN_KEY.REFRESH);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },
};