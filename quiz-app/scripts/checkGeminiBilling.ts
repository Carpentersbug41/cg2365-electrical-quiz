/**
 * Diagnostic script to check LLM API billing status
 * Supports both Google AI Studio and Vertex AI
 * Helps identify why free tier limits are being hit despite having credits
 */

import * as fs from 'fs';
import * as path from 'path';
import { createLLMClientWithFallback } from '../src/lib/llm/client';
import { getGeminiModelWithDefault, shouldUseVertexAI, isVertexAIConfigured, getGoogleCloudProject } from '../src/lib/config/geminiConfig';

// Load environment variables from .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

let modelName: string;
try {
  modelName = process.env.GEMINI_MODEL || getGeminiModelWithDefault();
} catch (error) {
  console.error('❌ GEMINI_MODEL is not set in environment variables');
  console.error('Please set GEMINI_MODEL in .env.local');
  process.exit(1);
}

const useVertexAI = shouldUseVertexAI();
const isVertexConfigured = isVertexAIConfigured();
const projectId = getGoogleCloudProject();

console.log('🔍 LLM API Billing Diagnostic\n');
console.log('=' .repeat(60));
console.log(`Provider: ${useVertexAI && isVertexConfigured ? 'Vertex AI' : 'Google AI Studio'}`);
console.log(`Model: ${modelName}`);
if (useVertexAI && isVertexConfigured) {
  console.log(`Project: ${projectId}`);
} else {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  } else {
    console.log('❌ GEMINI_API_KEY not found');
  }
}
console.log('=' .repeat(60));
console.log('');

async function checkBillingStatus() {
  try {
    const client = await createLLMClientWithFallback();
    
    console.log('📊 Testing API call to check quota limits...\n');
    
    const model = client.getGenerativeModel({ 
      model: modelName,
      generationConfig: { 
        temperature: 0,
        maxOutputTokens: 10, // Minimal request to test
      }
    });
    
    // Make a tiny test request
    const result = await model.generateContent('Say "test"');
    const response = result.response.text();
    
    console.log('✅ API call succeeded!');
    console.log(`Response: "${response}"\n`);
    console.log('💡 This means billing IS working. If you hit quota limits,');
    console.log('   it might be a rate limit (requests per minute) rather than');
    console.log('   daily quota. Check the error message for details.\n');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.log('❌ API call failed with error:\n');
    console.log(errorMessage);
    console.log('');
    
    // Analyze error
    if (errorMessage.includes('429')) {
      if (errorMessage.includes('free_tier')) {
        console.log('🔴 PROBLEM IDENTIFIED: Free tier quota limit hit');
        console.log('');
        if (useVertexAI && isVertexConfigured) {
          console.log('For Vertex AI, check:');
          console.log('1. Vertex AI API is enabled: aiplatform.googleapis.com');
          console.log('2. Service account has roles/aiplatform.user role');
          console.log('3. Billing is enabled on the project');
          console.log('4. Check: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com');
        } else {
          console.log('This means your API key is NOT using billing. Possible causes:');
          console.log('');
          console.log('1. API key created from Google AI Studio (makersuite.google.com)');
          console.log('   → These default to free tier even with billing enabled');
          console.log('');
          console.log('2. API key not linked to a Google Cloud project with billing');
          console.log('   → Check: https://console.cloud.google.com/apis/credentials');
          console.log('');
          console.log('3. Gemini API not enabled in the billed project');
          console.log('   → Check: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
          console.log('');
          console.log('📋 SOLUTION STEPS:');
          console.log('');
          console.log('Option A: Link existing API key to billed project');
          console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
          console.log('2. Find your API key');
          console.log('3. Click "Edit" → "Restrict key"');
          console.log('4. Under "API restrictions", select "Restrict key"');
          console.log('5. Enable "Generative Language API"');
          console.log('6. Make sure the project has billing enabled');
          console.log('');
          console.log('Option B: Create new API key from Google Cloud Console');
          console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
          console.log('2. Select a project WITH billing enabled');
          console.log('3. Click "Create Credentials" → "API Key"');
          console.log('4. Restrict to "Generative Language API"');
          console.log('5. Copy the new key to .env.local');
          console.log('');
          console.log('Option C: Switch to Vertex AI');
          console.log('1. Set USE_VERTEX_AI=true in .env.local');
          console.log('2. Set GOOGLE_CLOUD_PROJECT=your-project-id');
          console.log('3. Set GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json');
          console.log('');
        }
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('per minute')) {
        console.log('⚠️  Rate limit hit (requests per minute)');
        console.log('   This is different from daily quota.');
        console.log('   Wait a minute and try again, or enable billing for higher limits.');
        console.log('');
      } else {
        console.log('⚠️  429 error but unclear if it\'s billing-related');
        console.log('   Check the error details above.');
        console.log('');
      }
    } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
      console.log('🔴 Authentication error - API key may be invalid');
      console.log('   Check that your API key is correct in .env.local');
      console.log('');
    } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      console.log('🔴 Model not found');
      console.log(`   Model "${modelName}" may not exist or not be available`);
      console.log('   Check: https://ai.google.dev/gemini-api/docs/models');
      console.log('');
    } else {
      console.log('⚠️  Unexpected error - see details above');
      console.log('');
    }
  }
}

// Run diagnostic
checkBillingStatus().catch(console.error);
