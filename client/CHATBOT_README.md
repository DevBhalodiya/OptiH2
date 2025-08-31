# OptiH2 Chatbot Setup

## What I've Added

✅ **Chatbot Component** - A floating chat interface that appears on all pages
✅ **API Route** - Handles communication with Google's Gemini AI
✅ **Layout Integration** - Chatbot is automatically included on every page

## Features

- **Floating Chat Button** - Bottom-right corner of every page
- **AI-Powered Responses** - Uses your Gemini API key for intelligent answers
- **OptiH2 Domain Knowledge** - Specialized in hydrogen optimization topics
- **Responsive Design** - Works on desktop and mobile
- **Dark/Light Theme Support** - Automatically adapts to your theme

## How to Use

1. **Start the Development Server**:
   ```bash
   cd client
   npm run dev
   ```

2. **Open Your Browser** and navigate to `http://localhost:3000`

3. **Look for the Chat Button** - Blue circular button in the bottom-right corner

4. **Click to Open** the chat interface and ask questions about:
   - Hydrogen production technologies
   - Renewable energy integration
   - Infrastructure optimization
   - Green hydrogen economics
   - National Hydrogen Mission

## Files Created

- `components/chatbot.tsx` - Main chatbot component
- `app/api/chatbot/route.ts` - API endpoint for Gemini integration
- Updated `app/layout.tsx` - Integrated chatbot into main layout

## Your Gemini API Key

The chatbot is already configured with your API key:
`AIzaSyAvvswidg_ZcKD-jdbQUTob_vlDbe9YKQE`

## Troubleshooting

If you encounter build errors:
1. Make sure you're in the `client` directory
2. Run `npm install` to ensure all dependencies are installed
3. Try `npm run dev` instead of `npm run build` for development

## Testing

Once the server is running, you can test the chatbot by:
1. Opening any page on your OptiH2 application
2. Clicking the floating chat button
3. Asking questions like:
   - "What is green hydrogen?"
   - "How does electrolysis work?"
   - "What is the National Hydrogen Mission?"

The chatbot will provide intelligent, context-aware responses using Gemini AI!
