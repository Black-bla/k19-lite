import { Client, Account, ID } from 'appwrite';
import * as WebBrowser from 'expo-web-browser';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || 'com.gtok.app',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
};

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize Account service
export const account = new Account(client);

// Authentication functions
export const authService = {
  // Create anonymous session for development/testing
  async loginWithGoogle() {
    try {
      const session = await account.createAnonymousSession();
      console.log('Created anonymous session:', session);
      return session;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Logout user
  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
};

export { ID };
export default client;
