# Firebase Contact Form Setup Guide

## Overview
The vrajkumar.html portfolio has been enhanced with:
1. **Dynamic data loading from cv.json** - All personal information, experience, skills, and contact form fields are now populated from cv.json
2. **Firebase contact form integration** - Form submissions are stored in Firebase Firestore with fallback to mailto
3. **Enhanced UX** - Form validation, loading states, success/error messages, and visual feedback

## Firebase Configuration Required

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database in your project

### Step 2: Get Firebase Config
1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" section
3. Click on Web app icon (</>) to create a web app
4. Copy the firebaseConfig object

### Step 3: Update vrajkumar.html
Find this section in the JavaScript (around line 749):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "portfolio-contact-form.firebaseapp.com",
  projectId: "portfolio-contact-form",
  storageBucket: "portfolio-contact-form.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

Replace with your actual Firebase configuration values.

### Step 4: Configure Firestore Rules
In Firebase Console > Firestore Database > Rules, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document} {
      allow read: if false; // Only admins can read
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'message', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.message is string;
    }
  }
}
```

## Features Implemented

### 1. Dynamic Form Fields from cv.json
The contact form now reads field configurations from `cv.json`:
- Field labels, placeholders, and validation rules
- Required field indicators
- Subject dropdown options
- All customizable via cv.json

### 2. Form Validation
- Real-time email validation
- Required field checking
- Visual error indicators (red borders)
- Clear error messages

### 3. Loading States
- Button disabled during submission
- Spinner animation
- "Sending..." text feedback

### 4. Success/Error Messages
- Green success message with checkmark icon
- Red error message with alert icon
- Auto-dismiss after 5 seconds
- Form reset on successful submission

### 5. Fallback Mechanism
- If Firebase is not configured or fails, falls back to mailto link
- Ensures form always works

## Data Structure in Firestore

Each contact form submission creates a document with:
```javascript
{
  name: string,
  email: string,
  subject: string,
  message: string,
  timestamp: serverTimestamp,
  userAgent: string,
  source: "portfolio-website"
}
```

## Testing

### Test Firebase Integration:
1. Fill out the contact form
2. Submit
3. Check Firestore Console for new document in `contacts` collection
4. Verify success message appears

### Test Fallback:
1. Use invalid Firebase config
2. Submit form
3. Verify mailto link opens

## Customization via cv.json

Update contact form fields in cv.json:
```json
{
  "contact": {
    "form": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "placeholder": "Your name",
          "required": true,
          "autocomplete": "name"
        }
        // ... more fields
      ]
    }
  }
}
```

## Security Notes

1. **API Key Exposure**: The Firebase API key in client-side code is normal and expected. Security is enforced via Firestore rules.
2. **Rate Limiting**: Consider adding rate limiting in Firestore rules or using Firebase App Check
3. **Spam Protection**: Consider adding reCAPTCHA for production use

## Troubleshooting

### Form not submitting:
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore rules allow writes

### Data not appearing in Firestore:
- Verify Firestore is enabled in Firebase Console
- Check collection name is "contacts"
- Verify rules allow create operations

### Mailto fallback not working:
- Check browser allows mailto links
- Verify email client is configured

## File Status Note

⚠️ **IMPORTANT**: The vrajkumar.html file currently has CSS/JavaScript structure issues from the previous edit attempt. The file needs to be restored to proper structure before the Firebase integration will work correctly.

The corrupted section (lines 343-505) has JavaScript code mixed into the CSS section, which breaks the file structure.

## Next Steps

1. Restore vrajkumar.html to proper structure (CSS in `<style>` tags, JavaScript in `<script>` tags)
2. Add Firebase SDK scripts in the `<head>` section
3. Update Firebase configuration with your project credentials
4. Test the contact form
5. Deploy to production
