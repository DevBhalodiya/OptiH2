import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAvvswidg_ZcKD-jdbQUTob_vlDbe9YKQE'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  message: string
  history: ChatMessage[]
}

// Fallback responses for common OptiH2 topics
const fallbackResponses = {
  'hydrogen': "Green hydrogen is a clean energy carrier produced through electrolysis using renewable electricity. It's a key component of India's National Hydrogen Mission for achieving energy independence and reducing carbon emissions.",
  'electrolysis': "Electrolysis is the process of splitting water (H2O) into hydrogen (H2) and oxygen (O2) using electricity. When powered by renewable energy, it produces green hydrogen with zero carbon emissions.",
  'national hydrogen mission': "India's National Hydrogen Mission aims to make India a global hub for green hydrogen production and export. The mission targets 5 million tonnes of green hydrogen production by 2030.",
  'renewable energy': "Renewable energy sources like solar and wind power are essential for producing green hydrogen. They provide clean electricity for electrolysis, making the entire hydrogen production process sustainable.",
  'infrastructure': "Hydrogen infrastructure includes production facilities, storage systems, transportation networks, and refueling stations. Optimizing this infrastructure is crucial for widespread hydrogen adoption.",
  'optimization': "Infrastructure optimization involves analyzing factors like location, capacity, transportation costs, and demand patterns to create the most efficient hydrogen supply chain network."
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create context-aware prompt for OptiH2
    const systemPrompt = `You are an AI assistant for OptiH2, a platform focused on green hydrogen infrastructure optimization in India. You have expertise in:

- Hydrogen production technologies (electrolysis, steam methane reforming, etc.)
- Renewable energy integration with hydrogen systems
- Infrastructure optimization and network planning
- Green hydrogen economics and policy
- National Hydrogen Mission and Indian context
- Energy storage and distribution systems
- Sustainability and environmental impact

Provide helpful, accurate, and contextually relevant responses. Keep responses concise but informative. If asked about topics outside your expertise, politely redirect to relevant OptiH2 features or suggest contacting the team.

Current conversation context: ${history.map(h => `${h.role}: ${h.content}`).join('\n')}

User question: ${message}`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    console.log('Sending request to Gemini API...')
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Gemini API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      
      // Try to provide a fallback response based on keywords
      const lowerMessage = message.toLowerCase()
      for (const [keyword, fallbackResponse] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(keyword)) {
          return NextResponse.json({
            response: fallbackResponse,
            timestamp: new Date().toISOString(),
            source: 'fallback'
          })
        }
      }
      
      // If no fallback matches, provide a helpful error message
      return NextResponse.json({
        response: "I'm experiencing some technical difficulties with my AI service right now. However, I can help you with basic information about OptiH2 and hydrogen optimization. Please try asking a specific question about hydrogen, electrolysis, or renewable energy, or try again in a few moments.",
        timestamp: new Date().toISOString(),
        source: 'error-fallback'
      })
    }

    const data = await response.json()
    console.log('Gemini API response data:', JSON.stringify(data, null, 2))
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response structure:', data)
      
      // Try fallback response
      const lowerMessage = message.toLowerCase()
      for (const [keyword, fallbackResponse] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(keyword)) {
          return NextResponse.json({
            response: fallbackResponse,
            timestamp: new Date().toISOString(),
            source: 'fallback'
          })
        }
      }
      
      throw new Error('Invalid response structure from Gemini API')
    }

    const responseText = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: responseText,
      timestamp: new Date().toISOString(),
      source: 'gemini'
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    
    // Try to provide a fallback response based on keywords
    try {
      const body = await request.json()
      const { message } = body
      
      if (message) {
        const lowerMessage = message.toLowerCase()
        for (const [keyword, fallbackResponse] of Object.entries(fallbackResponses)) {
          if (lowerMessage.includes(keyword)) {
            return NextResponse.json({
              response: fallbackResponse,
              timestamp: new Date().toISOString(),
              source: 'fallback'
            })
          }
        }
      }
    } catch (parseError) {
      console.error('Could not parse request for fallback:', parseError)
    }
    
    return NextResponse.json(
      { 
        response: "I'm currently experiencing technical difficulties. Please try asking a specific question about hydrogen optimization, renewable energy, or the National Hydrogen Mission. You can also try refreshing the page or contacting support if the issue persists.",
        timestamp: new Date().toISOString(),
        source: 'error'
      },
      { status: 500 }
    )
  }
}
