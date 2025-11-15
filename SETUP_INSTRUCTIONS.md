# Portfolio Setup Instructions

## 📧 Email Contact Form Setup (EmailJS)

To enable the contact form to send messages directly to your email inbox, follow these steps:

### 1. Install EmailJS Package
```bash
npm install @emailjs/browser
```

### 2. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 3. Configure EmailJS Service
1. **Add Email Service:**
   - Go to "Email Services" in dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Connect your email: `akashsofficial62@gmail.com`
   - Note down your **Service ID**

2. **Create Email Template:**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template:
   ```
   Subject: New Contact Form Message - {{subject}}
   
   From: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   ```
   - Note down your **Template ID**

3. **Get Public Key:**
   - Go to "Account" → "General"
   - Copy your **Public Key**

### 4. Update Contact.js
Open `src/pages/Contact.js` and replace these placeholders (line ~35-37):
```javascript
const serviceID = 'service_YOUR_SERVICE_ID'; // Replace with your Service ID
const templateID = 'template_YOUR_TEMPLATE_ID'; // Replace with your Template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your Public Key
```

Example:
```javascript
const serviceID = 'service_abc123';
const templateID = 'template_xyz789';
const publicKey = 'Xy7Z9aBcDeFgHi';
```

### 5. Test the Contact Form
1. Run `npm start`
2. Navigate to `/contact`
3. Fill out the form and submit
4. Check your email inbox at `akashsofficial62@gmail.com`

---

## 🖼️ Profile Photos Setup

To add your profile photos for the sliding avatar animation on the About page:

### 1. Add Your Photos
Place 3 profile photos in the `public/images/` folder with these exact names:
- `profile1.jpg`
- `profile2.jpg`
- `profile3.jpg`

### 2. Photo Requirements
- **Format:** JPG, PNG, or WebP
- **Size:** Square images (1:1 ratio) recommended
- **Resolution:** 300x300px to 600x600px
- **File size:** Under 500KB each

### 3. Photos will automatically cycle every 3 seconds on the About page hero section

---

## 📝 Notes
- EmailJS free tier allows 200 emails/month
- Make sure to keep your EmailJS keys secure
- Don't commit your actual keys to public repositories
- Consider using environment variables for production
