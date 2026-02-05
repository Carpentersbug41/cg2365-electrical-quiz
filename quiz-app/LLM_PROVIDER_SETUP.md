# LLM Provider Setup Guide

This application supports two LLM providers for Gemini models:
1. **Google AI Studio** (default) - Uses API keys
2. **Vertex AI** - Uses service account authentication

Both implementations are available simultaneously, and you can switch between them using the `USE_VERTEX_AI` environment variable.

## Quick Start

### Using Google AI Studio (Default)

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```
3. That's it! The app will use Google AI Studio automatically.

### Using Vertex AI

1. Set up Google Cloud Project (see [Vertex AI Setup](#vertex-ai-setup) below)
2. Add to `.env.local`:
   ```env
   USE_VERTEX_AI=true
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```
3. Restart the application.

## Google AI Studio Setup

### How It Works

- **SDK**: `@google/generative-ai`
- **Authentication**: API key (`GEMINI_API_KEY`)
- **Endpoint**: `generativelanguage.googleapis.com`
- **Billing**: Uses free tier by default (20 requests/day), or billing if API key is linked to a billed project

### Setup Steps

1. **Get API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Click "Get API Key"
   - Create a new key or use an existing one

2. **Configure Environment**
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.0-flash-exp
   GEMINI_FALLBACK_MODEL=gemini-3-flash-preview
   ```

3. **Link to Billed Project (Optional)**
   - Go to [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)
   - Find your API key
   - Click "Edit" → "Restrict key"
   - Under "API restrictions", select "Restrict key"
   - Enable "Generative Language API"
   - Ensure the project has billing enabled

### Advantages

- ✅ Simple setup (just an API key)
- ✅ Works immediately
- ✅ Good for development and testing
- ✅ Free tier available

### Limitations

- ⚠️ Free tier: 20 requests/day per model
- ⚠️ API keys can be exposed if not secured properly
- ⚠️ Less enterprise features (IAM, audit logs, etc.)

## Vertex AI Setup

### How It Works

- **SDK**: `@google-cloud/vertexai`
- **Authentication**: Service account via Application Default Credentials (ADC)
- **Endpoint**: `aiplatform.googleapis.com`
- **Billing**: Uses your Google Cloud billing account directly

### Prerequisites

1. **Google Cloud Project**
   - Create or select a project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable billing on the project
   - Note your Project ID

2. **Enable Vertex AI API**
   - Go to [Vertex AI API](https://console.cloud.google.com/apis/library/aiplatform.googleapis.com)
   - Click "Enable"

3. **Create Service Account**
   - Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
   - Click "Create Service Account"
   - Name: `vertex-ai-user` (or your preferred name)
   - Grant role: `Vertex AI User` (`roles/aiplatform.user`)
   - Click "Done"

4. **Create and Download Key**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the key file
   - **Important**: Keep this file secure and never commit it to git

### Setup Steps

1. **Configure Environment Variables**

   For local development:
   ```env
   USE_VERTEX_AI=true
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

   For production (Vercel):
   - Add `USE_VERTEX_AI=true`
   - Add `GOOGLE_CLOUD_PROJECT=your-project-id`
   - Add `GOOGLE_CLOUD_LOCATION=us-central1`
   - Add `GOOGLE_APPLICATION_CREDENTIALS` as the JSON content of your service account key (or use Vercel's service account integration)

2. **Set Application Default Credentials**

   For local development, you can either:
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to the JSON key file
   - Or run: `gcloud auth application-default login`

### Advantages

- ✅ Enterprise-grade authentication (IAM, service accounts)
- ✅ Better billing integration (uses your GCP billing directly)
- ✅ Higher quotas and rate limits
- ✅ Audit logs and monitoring
- ✅ More control over access and permissions

### Limitations

- ⚠️ More complex setup (requires GCP project and service account)
- ⚠️ Requires Google Cloud billing account
- ⚠️ Service account keys need to be managed securely

## Switching Between Providers

### Switch to Vertex AI

1. Set `USE_VERTEX_AI=true` in `.env.local`
2. Configure Vertex AI environment variables (see above)
3. Restart the application

### Switch Back to Google AI Studio

1. Set `USE_VERTEX_AI=false` or remove the variable
2. Ensure `GEMINI_API_KEY` is set
3. Restart the application

### Automatic Fallback

The application includes automatic fallback:
- If Vertex AI is configured but fails to initialize, it automatically falls back to Google AI Studio
- If Google AI Studio is not configured, you'll get an error

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `USE_VERTEX_AI` | No | `false` | Set to `true` to use Vertex AI, `false` or unset for Google AI Studio |
| `GEMINI_API_KEY` | Yes* | - | Google AI Studio API key (required if not using Vertex AI) |
| `GEMINI_MODEL` | **Yes** | - | Model name to use (required) |
| `GEMINI_FALLBACK_MODEL` | No | - | Fallback model if primary fails (optional, defaults to primary model if not set) |
| `GOOGLE_CLOUD_PROJECT` | Yes** | - | GCP project ID (required if `USE_VERTEX_AI=true`) |
| `GOOGLE_CLOUD_LOCATION` | Yes** | `us-central1` | GCP region (required if `USE_VERTEX_AI=true`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes** | - | Path to service account JSON key (required if `USE_VERTEX_AI=true` for local dev) |

\* Required if `USE_VERTEX_AI` is not set or `false`  
\** Required if `USE_VERTEX_AI=true`

## Troubleshooting

### Google AI Studio Issues

**Problem**: "API key is invalid"
- Check that `GEMINI_API_KEY` is set correctly
- Verify the API key is active in [Google AI Studio](https://aistudio.google.com/)

**Problem**: "Quota exceeded" or "Free tier limit"
- Your API key is using free tier (20 requests/day)
- Link your API key to a billed project (see [Google AI Studio Setup](#google-ai-studio-setup))
- Or switch to Vertex AI

**Problem**: "Model not found"
- Check that `GEMINI_MODEL` is set to a valid model name
- See [Gemini Models](https://ai.google.dev/gemini-api/docs/models) for available models

### Vertex AI Issues

**Problem**: "GOOGLE_CLOUD_PROJECT is not set"
- Set `GOOGLE_CLOUD_PROJECT` in `.env.local`
- Verify the project ID is correct

**Problem**: "Authentication error" or "Permission denied"
- Check that `GOOGLE_APPLICATION_CREDENTIALS` points to a valid service account key file
- Verify the service account has `roles/aiplatform.user` role
- For production, ensure service account is attached to your deployment

**Problem**: "Vertex AI API not enabled"
- Enable Vertex AI API: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
- Wait a few minutes for the API to be fully enabled

**Problem**: "Model not found"
- Vertex AI may use slightly different model names
- Check available models in your region
- Common models: `gemini-2.0-flash-exp`, `gemini-1.5-flash`, `gemini-1.5-pro`

### General Issues

**Problem**: "LLM client not configured"
- Ensure either `GEMINI_API_KEY` is set (for Google AI Studio) or Vertex AI is configured
- Check that environment variables are loaded correctly
- Restart the application after changing environment variables

**Problem**: Application falls back unexpectedly
- Check logs for initialization errors
- Verify all required environment variables are set
- Test with the diagnostic script: `npm run checkGeminiBilling` (if available)

## Testing Your Setup

### Test Google AI Studio

```bash
# Set environment variables
export GEMINI_API_KEY=your_key_here
export USE_VERTEX_AI=false

# Run the app
npm run dev
```

### Test Vertex AI

```bash
# Set environment variables
export USE_VERTEX_AI=true
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=us-central1
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# Run the app
npm run dev
```

## Migration Guide

### From Google AI Studio to Vertex AI

1. Set up Vertex AI (see [Vertex AI Setup](#vertex-ai-setup))
2. Add Vertex AI environment variables to `.env.local`
3. Set `USE_VERTEX_AI=true`
4. Keep `GEMINI_API_KEY` as fallback (optional)
5. Test thoroughly
6. Once verified, you can remove `GEMINI_API_KEY` if desired

### From Vertex AI to Google AI Studio

1. Set `USE_VERTEX_AI=false` or remove the variable
2. Ensure `GEMINI_API_KEY` is set
3. Remove Vertex AI environment variables (optional)
4. Restart the application

## Best Practices

1. **Development**: Use Google AI Studio for simplicity
2. **Production**: Consider Vertex AI for better billing integration and enterprise features
3. **Security**: Never commit API keys or service account keys to git
4. **Fallback**: Keep both configured during migration for safety
5. **Monitoring**: Monitor usage and costs in Google Cloud Console

## Additional Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Google Cloud IAM](https://cloud.google.com/iam/docs)
