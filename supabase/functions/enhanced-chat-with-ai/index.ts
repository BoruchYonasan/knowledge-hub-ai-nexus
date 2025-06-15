
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  context: string;
  conversationId?: string;
  conversationHistory?: Array<{
    content: string;
    sender: 'user' | 'ai';
    model_used?: string;
  }>;
  selectedModel?: string;
  files?: Array<{
    name: string;
    content: string;
  }>;
}

// Model mapping from display names to API model names
const getApiModelName = (selectedModel: string) => {
  const modelMap = {
    'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
    'claude-sonnet-4': 'claude-3-5-sonnet-20241022',
    'chatgpt-4.1': 'gpt-4o',
    'grok-3': 'grok-beta'
  };
  return modelMap[selectedModel] || 'gemini-2.0-flash-exp';
};

// Build conversation context
const buildConversationContext = (
  baseContext: string,
  conversationHistory: Array<{content: string; sender: 'user' | 'ai'}> = [],
  files: Array<{name: string; content: string}> = []
) => {
  let context = baseContext;
  
  // Add conversation history
  if (conversationHistory.length > 0) {
    context += '\n\nCONVERSATION HISTORY:\n';
    const recentHistory = conversationHistory.slice(-10); // Last 10 messages
    recentHistory.forEach((msg, index) => {
      context += `${msg.sender.toUpperCase()}: ${msg.content}\n`;
    });
    context += '\nPlease maintain context from this conversation history when responding.\n';
  }
  
  // Add files context
  if (files.length > 0) {
    context += '\n\nUPLOADED FILES:\n';
    files.forEach(file => {
      context += `--- FILE: ${file.name} ---\n${file.content}\n--- END FILE ---\n`;
    });
  }
  
  return context;
};

// Call Gemini API
const callGemini = async (message: string, context: string) => {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${context}\n\nUser message: ${message}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I encountered an error.';
};

// Call Claude API
const callClaude = async (message: string, context: string) => {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    console.log('ANTHROPIC_API_KEY not configured, falling back to Gemini');
    return await callGemini(message, context);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nUser message: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'Sorry, I encountered an error with Claude.';
  } catch (error) {
    console.error('Claude API error:', error);
    console.log('Falling back to Gemini');
    return await callGemini(message, context);
  }
};

// Call OpenAI API
const callOpenAI = async (message: string, context: string) => {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    console.log('OPENAI_API_KEY not configured, falling back to Gemini');
    return await callGemini(message, context);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: context
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I encountered an error with OpenAI.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.log('Falling back to Gemini');
    return await callGemini(message, context);
  }
};

// Call Grok API (XAI)
const callGrok = async (message: string, context: string) => {
  const xaiApiKey = Deno.env.get('XAI_API_KEY');
  if (!xaiApiKey) {
    console.log('XAI_API_KEY not configured, falling back to Gemini');
    return await callGemini(message, context);
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: context
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I encountered an error with Grok.';
  } catch (error) {
    console.error('Grok API error:', error);
    console.log('Falling back to Gemini');
    return await callGemini(message, context);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      context, 
      conversationId,
      conversationHistory = [],
      selectedModel = 'gemini-2.0-flash-exp',
      files = []
    }: ChatRequest = await req.json();

    console.log(`Processing message with selected model: ${selectedModel}`);
    
    // Get the API model name
    const apiModelName = getApiModelName(selectedModel);
    console.log(`Using API model: ${apiModelName}`);

    // Build enhanced context with conversation history
    const enhancedContext = buildConversationContext(context, conversationHistory, files);

    // Call appropriate AI model based on user selection
    let response: string;
    switch (selectedModel) {
      case 'claude-sonnet-4':
        response = await callClaude(message, enhancedContext);
        break;
      case 'chatgpt-4.1':
        response = await callOpenAI(message, enhancedContext);
        break;
      case 'grok-3':
        response = await callGrok(message, enhancedContext);
        break;
      case 'gemini-2.0-flash-exp':
      default:
        response = await callGemini(message, enhancedContext);
        break;
    }

    console.log(`AI response generated successfully using ${selectedModel}`);

    return new Response(JSON.stringify({ 
      response,
      modelUsed: selectedModel,
      conversationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: 'Sorry, I encountered an error. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
