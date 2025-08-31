"use client"

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  source?: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your OptiH2 AI assistant. I can help you with hydrogen infrastructure optimization, renewable energy insights, and answer questions about green hydrogen technology. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
      source: 'welcome'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        source: data.source || 'unknown'
      }

      setMessages(prev => [...prev, assistantMessage])
      setRetryCount(0) // Reset retry count on success
      
    } catch (error) {
      console.error('Chatbot error:', error)
      
      let errorMessage: Message
      
      if (retryCount < 2) {
        // Suggest retry for first few failures
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: `I'm having trouble connecting to my AI service. This might be a temporary issue. Please try again in a moment, or ask me about specific topics like "hydrogen", "electrolysis", or "renewable energy".`,
          role: 'assistant',
          timestamp: new Date(),
          source: 'retry-suggestion'
        }
        setRetryCount(prev => prev + 1)
      } else {
        // After multiple failures, provide helpful fallback
        errorMessage = {
          id: (Date.now() + 1).toString(),
          content: `I'm experiencing persistent technical difficulties. Here are some topics I can help you with:\n\n• **Green Hydrogen**: Clean energy carrier from renewable sources\n• **Electrolysis**: Water splitting process for hydrogen production\n• **National Hydrogen Mission**: India's 2030 hydrogen goals\n• **Infrastructure**: Production, storage, and distribution networks\n\nPlease try refreshing the page or contact support if you need immediate assistance.`,
          role: 'assistant',
          timestamp: new Date(),
          source: 'fallback-help'
        }
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const getMessageIcon = (message: Message) => {
    if (message.source === 'error' || message.source === 'retry-suggestion' || message.source === 'fallback-help') {
      return <AlertCircle className="w-4 h-4 text-amber-500" />
    }
    return <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
  }

  const getMessageStyle = (message: Message) => {
    if (message.source === 'error' || message.source === 'retry-suggestion' || message.source === 'fallback-help') {
      return 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 z-50 ${
          isOpen ? 'scale-90' : ''
        }`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 mx-auto" />
        ) : (
          <MessageCircle className="w-6 h-6 mx-auto" />
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Bot className="w-5 h-5 text-blue-600" />
              OptiH2 AI Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      {getMessageIcon(message)}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : `${getMessageStyle(message)} rounded-bl-md`
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 text-sm rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about hydrogen optimization..."
                className="flex-1 h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-9 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
