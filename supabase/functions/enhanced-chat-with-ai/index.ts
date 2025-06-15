
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
  preferredModel?: string;
  files?: Array<{
    name: string;
    content: string;
  }>;
}

// Model selection logic
const selectModel = (message: string, preferredModel?: string, isFollowUp?: boolean) => {
  const messageLength = message.length;
  const isComplex = messageLength > 200 || 
                   message.includes('create') || 
                   message.includes('implement') ||
                   message.includes('refactor') ||
                   isFollowUp;

  // Use preferred model if specified and appropriate
  if (preferredModel) {
    if (preferredModel === 'claude-sonnet-4' && isComplex) return 'claude-sonnet-4';
    if (preferredModel === 'gpt-4o' && isComplex) return 'gpt-4o';
    if (preferredModel === 'gemini-2.0-flash-exp') return 'gemini-2.0-flash-exp';
  }

  // Auto-select based on complexity
  if (isComplex) {
    return 'claude-sonnet-4'; // Default to Claude for complex tasks
  }
  
  return 'gemini-2.0-flash-exp'; // Default to Gemini for simple tasks
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

// Call Claude API (placeholder - you'd need to add Anthropic API key)
const callClaude = async (message: string, context: string) => {
  // For now, fall back to Gemini since Claude API key isn't configured
  console.log('Claude model requested but not configured, falling back to Gemini');
  return await callGemini(message, context);
};

// Call OpenAI API (placeholder - you'd need to add OpenAI API key)
const callOpenAI = async (message: string, context: string) => {
  // For now, fall back to Gemini since OpenAI API key isn't configured
  console.log('OpenAI model requested but not configured, falling back to Gemini');
  return await callGemini(message, context);
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
      preferredModel,
      files = []
    }: ChatRequest = await req.json();

    console.log(`Processing message with ${conversationHistory.length} history items`);
    
    // Select appropriate model
    const isFollowUp = conversationHistory.length > 0;
    const selectedModel = selectModel(message, preferredModel, isFollowUp);
    console.log(`Selected model: ${selectedModel}`);

    // Build enhanced context with conversation history
    const enhancedContext = buildConversationContext(context, conversationHistory, files);

    // Call appropriate AI model
    let response: string;
    switch (selectedModel) {
      case 'claude-sonnet-4':
        response = await callClaude(message, enhancedContext);
        break;
      case 'gpt-4o':
        response = await callOpenAI(message, enhancedContext);
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
