# Premium Dairy Products - AI Voice Sales Chatbot

This is a modern responsive Next.js application designed as a chatbot widget for selling "Cow Desi Ghee" and "Fresh Butter". It uses Google's Gemini API for conversational AI and the Browser's Web Speech API for voice-to-text input and text-to-speech output.

## Features
- **Floating Chat Widget**: A WhatsApp-style button to quickly toggle the interface from the bottom right.
- **Voice Intelligence**: Talk directly to the AI using the microphone button and have the AI speak its responses aloud.
- **Order Collection Flow**: The chatbot contextually collects 5 pieces of information: Product name, Quantity, Customer name, City, and Phone number.
- **WhatsApp Checkout**: Generates a custom pre-filled WhatsApp link upon successful order completion formatting.
- **Smart UI**: Uses `framer-motion` and Tailwind CSS to create smooth modern message bubbles and transitions.

## Prerequisites
- Node.js (Version 18 or above recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## Local Development
1. **Environment Variables Config**
   Create a `.env.local` file in the root of the `chatbot-widget` folder, and add your API Key:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Run the Server**
   ```bash
   npm run dev
   ```

3. **Verify locally**
   - Open your browser to [http://localhost:3000](http://localhost:3000).
   - Try placing an order through the prompt "I want to buy ghee".
   - Test the microphone and speaker features (note: microphone privileges require HTTPS or `localhost` context).

## Deployment (Vercel)
This Next.js application is instantly compatible with Vercel.
1. Push this `chatbot-widget` repository code to GitHub.
2. In the Vercel dashboard, click "Add New Project" and import your repository.
3. In the Environment Variables section before deploying, **ensure you add `GEMINI_API_KEY`**.
4. Click Deploy. Your widget API routing and front-end will be fully hosted on Vercel's Edge network.
