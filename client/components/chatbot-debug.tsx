"use client"

import { useState } from 'react'

export function ChatbotDebug() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Simple Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 z-50"
        aria-label="Open chat"
      >
        {isOpen ? 'X' : '💬'}
      </button>

      {/* Simple Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">OptiH2 AI Assistant (Debug)</h3>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is a debug version of the chatbot to test basic functionality.
            </p>
            
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✅ Chat button is working
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Chat interface opens/closes
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  🔍 Check browser console for any errors
                </p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Debug mode - No actual chat functionality
            </div>
          </div>
        </div>
      )}
    </>
  )
}
