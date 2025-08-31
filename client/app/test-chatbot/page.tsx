export default function TestChatbotPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Chatbot Test Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Testing the OptiH2 Chatbot
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You should see a blue circular chat button in the bottom-right corner of this page.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                ✅ What to Look For:
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Blue circular button with chat icon (bottom-right)</li>
                <li>• Click to open chat interface</li>
                <li>• Try asking: "What is green hydrogen?"</li>
                <li>• Icons should display properly</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                🧪 Test Questions:
              </h3>
              <ul className="text-green-800 dark:text-green-200 space-y-1">
                <li>• "What is green hydrogen?"</li>
                <li>• "How does electrolysis work?"</li>
                <li>• "Tell me about the National Hydrogen Mission"</li>
                <li>• "What is renewable energy?"</li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                🔍 Troubleshooting:
              </h3>
              <ul className="text-amber-800 dark:text-amber-200 space-y-1">
                <li>• Check browser console for errors</li>
                <li>• Verify lucide-react icons are loading</li>
                <li>• Ensure API route is accessible</li>
                <li>• Check network tab for API calls</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> The chatbot should appear on all pages since it's integrated into the main layout. 
              If you don't see it, check the browser console for any JavaScript errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
