# Gemini API Billing Quota Issue - Root Cause & Solution

**Date:** 2026-01-20  
**Status:** 🔴 Issue Identified - Action Required  
**Priority:** High

---

## 🔴 The Problem

You're getting this error when trying to use LLM marking:

```
⚠️ Marking service quota exceeded.
Error code: QUOTA_EXCEEDED-...

[429 Too Many Requests] You exceeded your current quota
* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
  limit: 20, model: gemini-2.5-flash
```

**Despite having $300 USD of Google Cloud credits available.**

---

## 🎯 Root Cause

Your Gemini API key is **NOT linked to a Google Cloud project with billing enabled**.

### Why This Happens

**API keys created from Google AI Studio** (`makersuite.google.com` or `aistudio.google.com`) **default to free tier quotas**, even if:
- ✅ You have billing enabled in Google Cloud
- ✅ You have $300 credit available
- ✅ The API key is valid and working

**The free tier limit is:**
- **20 requests per day** per model
- **No access to billing credits**
- **Strict rate limits**

---

## 🔍 How We Diagnosed It

We ran a diagnostic script that confirmed:

```
🔴 PROBLEM IDENTIFIED: Free tier quota limit hit

Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
limit: 20, model: gemini-2.5-flash
```

The error message explicitly mentions `free_tier_requests`, which means billing is **not** being used.

---

## ✅ The Solution

You need to **link your API key to a Google Cloud project with billing enabled**.

### Option A: Link Existing API Key (Recommended)

**Step 1: Open Google Cloud Console**
- Go to: https://console.cloud.google.com/apis/credentials
- Make sure you're signed in with the account that has billing enabled

**Step 2: Find Your API Key**
- Look for the key that starts with `AIzaSy...` (the one in your `.env.local`)
- Click the **Edit** icon (pencil) next to it

**Step 3: Configure API Restrictions**
- Under **"API restrictions"**:
  - Select **"Restrict key"**
  - Check **"Generative Language API"** ✅
  - Make sure it's enabled

**Step 4: Verify Project Has Billing**
- Look at the top of the page - it shows which **Project** the key belongs to
- Click the project dropdown if needed
- Verify the project has billing enabled:
  - Go to: https://console.cloud.google.com/billing
  - Check that your project is linked to a billing account
  - Verify $300 credit is available

**Step 5: Save Changes**
- Click **"Save"** at the bottom
- Wait 1-2 minutes for changes to propagate

**Step 6: Test**
```bash
cd quiz-app
npx tsx scripts/checkGeminiBilling.ts
```

You should see: `✅ API call succeeded!` instead of the free tier error.

---

### Option B: Create New API Key from Google Cloud Console

If linking doesn't work, create a new key directly from Google Cloud Console:

**Step 1: Open Credentials Page**
- Go to: https://console.cloud.google.com/apis/credentials
- **Important:** Make sure you select a project WITH billing enabled (check dropdown at top)

**Step 2: Create New API Key**
- Click **"+ CREATE CREDENTIALS"**
- Select **"API key"**
- A new key will be created

**Step 3: Restrict the Key**
- Click **"Restrict key"** (or click Edit on the new key)
- Under **"API restrictions"**:
  - Select **"Restrict key"**
  - Enable **"Generative Language API"** ✅
- Click **"Save"**

**Step 4: Update Your Environment**
- Copy the new API key
- Update `quiz-app/.env.local`:
  ```bash
  GEMINI_API_KEY=your_new_key_here
  ```
- Restart your dev server

**Step 5: Test**
```bash
cd quiz-app
npx tsx scripts/checkGeminiBilling.ts
```

---

## 🔍 How to Verify Billing is Working

### Method 1: Run Diagnostic Script

```bash
cd quiz-app
npx tsx scripts/checkGeminiBilling.ts
```

**Success looks like:**
```
✅ API call succeeded!
Response: "test"

💡 This means billing IS working.
```

**Failure looks like:**
```
❌ API call failed with error:
[429 Too Many Requests] ... free_tier_requests ...
🔴 PROBLEM IDENTIFIED: Free tier quota limit hit
```

### Method 2: Check Google Cloud Console

1. Go to: https://console.cloud.google.com/billing
2. Verify:
   - ✅ Billing account exists
   - ✅ $300 credit is available
   - ✅ Your project is linked to the billing account

3. Go to: https://console.cloud.google.com/apis/dashboard
4. Search for "Generative Language API"
5. Click on it
6. Check **"Quotas"** tab
7. You should see higher limits (not just 20/day)

### Method 3: Test in Your App

1. Restart your dev server:
   ```bash
   cd quiz-app
   npm run dev
   ```

2. Navigate to: http://localhost:3000/learn/202-3A
3. Answer a conceptual question
4. Submit it
5. Should work without quota errors

---

## 📊 Expected Behavior After Fix

### Before Fix (Free Tier)
- ❌ 20 requests/day limit
- ❌ Quota exceeded errors
- ❌ No access to billing credits
- ❌ Strict rate limits

### After Fix (Billed)
- ✅ Higher daily limits (typically 1,500+ requests/day)
- ✅ Uses your $300 credit
- ✅ Better rate limits
- ✅ No quota errors (until credit runs out)

---

## 🐛 Troubleshooting

### "I linked the key but still getting free tier errors"

**Possible causes:**
1. **Changes haven't propagated** - Wait 2-5 minutes and try again
2. **Wrong project selected** - Make sure the API key is in the project with billing
3. **Billing not enabled** - Check https://console.cloud.google.com/billing
4. **API not enabled** - Check https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

**Solution:**
- Create a NEW API key from Google Cloud Console (Option B above)
- This ensures it's created in the correct project from the start

### "I can't find my API key in Google Cloud Console"

**Possible causes:**
- Key was created from Google AI Studio (not Cloud Console)
- Key is in a different Google account
- Key was deleted

**Solution:**
- Create a new key using Option B above
- Make sure you're signed into the correct Google account

### "Billing shows $300 credit but API still fails"

**Check:**
1. Is the API key in the same project as billing?
2. Is "Generative Language API" enabled in that project?
3. Did you wait 2-5 minutes after making changes?

**Solution:**
- Create a new API key directly in the billed project
- This ensures everything is linked correctly

---

## 📝 Summary

**The Issue:**
- API key created from Google AI Studio defaults to free tier
- Free tier = 20 requests/day, no billing access
- Your $300 credit is available but not being used

**The Fix:**
- Link API key to Google Cloud project with billing enabled
- OR create new key from Google Cloud Console
- Verify with diagnostic script

**The Result:**
- API uses your billing credits
- Higher quota limits
- No more quota exceeded errors

---

## 🔗 Useful Links

- **API Credentials:** https://console.cloud.google.com/apis/credentials
- **Billing Dashboard:** https://console.cloud.google.com/billing
- **Enable Generative Language API:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- **Quota Limits:** https://ai.google.dev/gemini-api/docs/rate-limits
- **Rate Limit Monitor:** https://ai.dev/rate-limit

---

**Last Updated:** 2026-01-20  
**Diagnostic Script:** `quiz-app/scripts/checkGeminiBilling.ts`
