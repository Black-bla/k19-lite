# Appwrite Setup Guide for gTok

This guide will help you set up Appwrite authentication for the gTok student productivity app.

## Prerequisites

1. Create an Appwrite account at [https://appwrite.io](https://appwrite.io)
2. Install Appwrite CLI (optional but recommended)

## Step 1: Create Appwrite Project

1. Log in to your Appwrite console
2. Click "Create Project"
3. Name your project "gTok" or similar
4. Copy the Project ID

## Step 2: Configure Authentication

1. Go to **Auth** in your project dashboard
2. Click **Settings** tab
3. Add these success/failure URLs:
   - Success URL: `gtok://auth/success`
   - Failure URL: `gtok://auth/failure`

## Step 3: Enable Google OAuth

1. In **Auth** → **Settings**
2. Find **OAuth2 Providers**
3. Enable **Google**
4. Add your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)

## Step 4: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Android** application type
6. Add package name: `com.gtok.app`
7. Get SHA-1 certificate fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
8. Copy Client ID and Client Secret to Appwrite

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Appwrite project details:
   ```
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   EXPO_PUBLIC_APPWRITE_PLATFORM=com.gtok.app
   ```

## Step 6: Configure App Scheme (app.json)

Add the custom URL scheme to handle OAuth redirects:

```json
{
  "expo": {
    "scheme": "gtok",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "gtok",
              "host": "auth"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "bundleIdentifier": "com.gtok.app"
    }
  }
}
```

## Step 7: Test Authentication

1. Start your development server: `npm start`
2. Run on device/emulator
3. Tap "Continue with Google"
4. Complete OAuth flow
5. Check if user is authenticated

## Troubleshooting

- **OAuth redirect not working**: Check URL scheme configuration
- **Google login fails**: Verify Google Cloud Console setup
- **Project ID error**: Ensure environment variables are set correctly
- **Network error**: Check Appwrite endpoint URL

## Security Notes

- Never commit `.env` file to version control
- Use different projects for development and production
- Regularly rotate OAuth credentials
- Enable 2FA on your Appwrite account
