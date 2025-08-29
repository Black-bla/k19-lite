# Supabase Setup Guide for gTok

This guide will help you set up Supabase authentication for the gTok app.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project

## Setup Steps

### 1. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 2. Configure Environment Variables

1. Update your `.env` file with your Supabase credentials:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Enable Google OAuth

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `gtok://auth/callback` (for mobile app)
   - Copy Client ID and Client Secret to Supabase

### 4. Configure Deep Linking

The app is already configured for deep linking with the scheme `gtok://auth/callback`.

### 5. Install Dependencies

Dependencies are already installed:
- `@supabase/supabase-js` - Supabase JavaScript client
- `expo-auth-session` - Expo authentication session handling
- `expo-web-browser` - Web browser for OAuth flow

### 6. Test Authentication

1. Start the development server: `npm start`
2. Open the app on a device or simulator
3. Try logging in with Google
4. Check the console for any authentication logs

## Authentication Flow

1. User taps "Continue with Google"
2. App opens Supabase OAuth URL in browser
3. User authenticates with Google
4. Google redirects to Supabase callback
5. Supabase redirects to app with tokens
6. App extracts tokens and creates session
7. User is logged in and navigated to main app

## Troubleshooting

### Common Issues

1. **OAuth URL not opening**: Check environment variables are set correctly
2. **Redirect not working**: Verify redirect URIs in Google Cloud Console
3. **Session not created**: Check Supabase logs in dashboard
4. **Deep link not working**: Ensure app scheme is configured properly

### Debug Steps

1. Check console logs for authentication errors
2. Verify Supabase project settings
3. Test OAuth flow in Supabase dashboard
4. Ensure Google OAuth credentials are correct

## Security Notes

- Never commit `.env` file to version control
- Use environment-specific configurations for production
- Regularly rotate API keys and secrets
- Enable Row Level Security (RLS) in Supabase for data protection

## Additional Features

Once authentication is working, you can extend with:
- User profiles and metadata
- Database operations with RLS
- Real-time subscriptions
- File storage and uploads
