
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentAction {
  type: 'create' | 'edit' | 'delete';
  contentType: 'update' | 'project' | 'gantt_item' | 'article';
  data: any;
}

const parseActionFromResponse = (response: string): ContentAction | null => {
  const actionPatterns = [
    { pattern: /CREATING_UPDATE:\s*({.*?})/s, type: 'create', contentType: 'update' },
    { pattern: /EDITING_UPDATE:\s*({.*?})/s, type: 'edit', contentType: 'update' },
    { pattern: /DELETING_UPDATE:\s*({.*?})/s, type: 'delete', contentType: 'update' },
    { pattern: /CREATING_PROJECT:\s*({.*?})/s, type: 'create', contentType: 'project' },
    { pattern: /EDITING_PROJECT:\s*({.*?})/s, type: 'edit', contentType: 'project' },
    { pattern: /DELETING_PROJECT:\s*({.*?})/s, type: 'delete', contentType: 'project' },
    { pattern: /CREATING_GANTT_ITEM:\s*({.*?})/s, type: 'create', contentType: 'gantt_item' },
    { pattern: /EDITING_GANTT_ITEM:\s*({.*?})/s, type: 'edit', contentType: 'gantt_item' },
    { pattern: /DELETING_GANTT_ITEM:\s*({.*?})/s, type: 'delete', contentType: 'gantt_item' },
    { pattern: /CREATING_ARTICLE:\s*({.*?})/s, type: 'create', contentType: 'article' },
    { pattern: /EDITING_ARTICLE:\s*({.*?})/s, type: 'edit', contentType: 'article' },
    { pattern: /DELETING_ARTICLE:\s*({.*?})/s, type: 'delete', contentType: 'article' },
  ];

  for (const { pattern, type, contentType } of actionPatterns) {
    const match = response.match(pattern);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        return { type: type as any, contentType: contentType as any, data };
      } catch (error) {
        console.error('Error parsing action data:', error);
      }
    }
  }
  return null;
};

const executeAction = async (supabase: any, action: ContentAction): Promise<{ success: boolean; result?: any; error?: string }> => {
  try {
    console.log('Executing action:', action);
    
    switch (action.contentType) {
      case 'update':
        return await executeUpdateAction(supabase, action);
      case 'project':
        return await executeProjectAction(supabase, action);
      case 'gantt_item':
        return await executeGanttAction(supabase, action);
      case 'article':
        return await executeArticleAction(supabase, action);
      default:
        return { success: false, error: 'Unknown content type' };
    }
  } catch (error) {
    console.error('Error executing action:', error);
    return { success: false, error: error.message };
  }
};

const executeUpdateAction = async (supabase: any, action: ContentAction) => {
  const { type, data } = action;
  
  switch (type) {
    case 'create':
      const { data: newUpdate, error: createError } = await supabase
        .from('latest_updates')
        .insert({
          title: data.title,
          content: data.content,
          preview: data.preview || data.content?.substring(0, 100) + '...',
          author: data.author,
          department: data.department,
          priority: data.priority || 'medium',
          attachments: data.attachments || []
        })
        .select()
        .single();
      
      if (createError) return { success: false, error: createError.message };
      return { success: true, result: newUpdate };
      
    case 'edit':
      const { data: updatedUpdate, error: updateError } = await supabase
        .from('latest_updates')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (updateError) return { success: false, error: updateError.message };
      return { success: true, result: updatedUpdate };
      
    case 'delete':
      const { error: deleteError } = await supabase
        .from('latest_updates')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) return { success: false, error: deleteError.message };
      return { success: true, result: { deleted: true, id: data.id } };
      
    default:
      return { success: false, error: 'Unknown action type' };
  }
};

const executeProjectAction = async (supabase: any, action: ContentAction) => {
  const { type, data } = action;
  
  switch (type) {
    case 'create':
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description,
          lead: data.lead,
          team: data.team,
          status: 'Planning',
          priority: data.priority || 'Medium',
          progress: 0,
          start_date: data.startDate,
          due_date: data.dueDate,
          attachments: data.attachments || []
        })
        .select()
        .single();
      
      if (createError) return { success: false, error: createError.message };
      return { success: true, result: newProject };
      
    case 'edit':
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (updateError) return { success: false, error: updateError.message };
      return { success: true, result: updatedProject };
      
    case 'delete':
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) return { success: false, error: deleteError.message };
      return { success: true, result: { deleted: true, id: data.id } };
      
    default:
      return { success: false, error: 'Unknown action type' };
  }
};

const executeGanttAction = async (supabase: any, action: ContentAction) => {
  const { type, data } = action;
  
  switch (type) {
    case 'create':
      const { data: newItem, error: createError } = await supabase
        .from('gantt_items')
        .insert({
          title: data.title,
          type: data.type || 'task',
          parent_id: data.parentId,
          assignee: data.assignee,
          priority: data.priority || 'Medium',
          status: data.status || 'Not Started',
          start_date: data.startDate,
          end_date: data.endDate,
          progress: data.progress || 0,
          resources: data.resources || [],
          dependencies: data.dependencies || [],
          description: data.description
        })
        .select()
        .single();
      
      if (createError) return { success: false, error: createError.message };
      return { success: true, result: newItem };
      
    case 'edit':
      const { data: updatedItem, error: updateError } = await supabase
        .from('gantt_items')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (updateError) return { success: false, error: updateError.message };
      return { success: true, result: updatedItem };
      
    case 'delete':
      const { error: deleteError } = await supabase
        .from('gantt_items')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) return { success: false, error: deleteError.message };
      return { success: true, result: { deleted: true, id: data.id } };
      
    default:
      return { success: false, error: 'Unknown action type' };
  }
};

const executeArticleAction = async (supabase: any, action: ContentAction) => {
  const { type, data } = action;
  
  switch (type) {
    case 'create':
      const { data: newArticle, error: createError } = await supabase
        .from('knowledge_base_articles')
        .insert({
          title: data.title,
          description: data.description,
          content: data.content,
          category: data.category || 'all',
          author: data.author,
          read_time: data.readTime || '5 min read',
          tags: data.tags || []
        })
        .select()
        .single();
      
      if (createError) return { success: false, error: createError.message };
      return { success: true, result: newArticle };
      
    case 'edit':
      const { data: updatedArticle, error: updateError } = await supabase
        .from('knowledge_base_articles')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (updateError) return { success: false, error: updateError.message };
      return { success: true, result: updatedArticle };
      
    case 'delete':
      const { error: deleteError } = await supabase
        .from('knowledge_base_articles')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) return { success: false, error: deleteError.message };
      return { success: true, result: { deleted: true, id: data.id } };
      
    default:
      return { success: false, error: 'Unknown action type' };
  }
};

const callAnthropic = async (messages: any[], systemPrompt: string) => {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY not set');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

const callOpenAI = async (messages: any[], systemPrompt: string, model: string) => {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) throw new Error('OPENAI_API_KEY not set');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callGemini = async (messages: any[], systemPrompt: string) => {
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiKey) throw new Error('GEMINI_API_KEY not set');

  const formattedMessages = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: formattedMessages,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 4000 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const callGrok = async (messages: any[], systemPrompt: string) => {
  const grokKey = Deno.env.get('XAI_API_KEY');
  if (!grokKey) throw new Error('XAI_API_KEY not set');

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokKey}`
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, conversationHistory = [], selectedModel = 'gemini-2.0-flash-exp', files = [] } = await req.json();
    
    console.log('Processing message with selected model:', selectedModel);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Add file context to system prompt if files are provided
    let enhancedContext = context;
    if (files && files.length > 0) {
      const fileContext = files.map((file: any) => 
        `File: ${file.name}\nContent: ${file.content.substring(0, 2000)}${file.content.length > 2000 ? '...' : ''}`
      ).join('\n\n');
      enhancedContext += `\n\nUploaded Files Context:\n${fileContext}`;
    }

    const messages = [...conversationHistory, { content: message, sender: 'user' }];
    
    let aiResponse: string;
    let modelUsed: string;

    try {
      switch (selectedModel) {
        case 'claude-sonnet-4':
          console.log('Using API model: claude-3-5-sonnet-20241022');
          aiResponse = await callAnthropic(messages, enhancedContext);
          modelUsed = selectedModel;
          break;
        case 'chatgpt-4.1':
          console.log('Using API model: gpt-4o');
          aiResponse = await callOpenAI(messages, enhancedContext, 'gpt-4o');
          modelUsed = selectedModel;
          break;
        case 'grok-3':
          console.log('Using API model: grok-beta');
          try {
            aiResponse = await callGrok(messages, enhancedContext);
            modelUsed = selectedModel;
          } catch (error) {
            console.log('Grok API error:', error);
            console.log('Falling back to Gemini');
            aiResponse = await callGemini(messages, enhancedContext);
            modelUsed = 'gemini-2.0-flash-exp';
          }
          break;
        case 'gemini-2.0-flash-exp':
        default:
          console.log('Using API model: gemini-2.0-flash-exp');
          aiResponse = await callGemini(messages, enhancedContext);
          modelUsed = selectedModel;
          break;
      }
    } catch (error) {
      console.log('Falling back to Gemini');
      aiResponse = await callGemini(messages, enhancedContext);
      modelUsed = 'gemini-2.0-flash-exp';
    }

    console.log(`AI response generated successfully using ${modelUsed}`);

    // Check if the AI response contains any actions to execute
    const action = parseActionFromResponse(aiResponse);
    let actionResult = null;
    let finalResponse = aiResponse;

    if (action) {
      console.log('Action detected, executing:', action);
      actionResult = await executeAction(supabase, action);
      
      if (actionResult.success) {
        // Update the AI response to reflect successful action execution
        const actionType = action.type.charAt(0).toUpperCase() + action.type.slice(1);
        const contentType = action.contentType.replace('_', ' ');
        finalResponse = finalResponse.replace(
          new RegExp(`${action.type.toUpperCase()}_${action.contentType.toUpperCase()}:.*?}`, 's'),
          `✅ I've successfully ${action.type}d the ${contentType} "${action.data.title || action.data.id}" for you! The changes have been applied to the website.`
        );
      } else {
        // Update the AI response to reflect failed action execution
        finalResponse = finalResponse.replace(
          new RegExp(`${action.type.toUpperCase()}_${action.contentType.toUpperCase()}:.*?}`, 's'),
          `❌ I encountered an error while trying to ${action.type} the ${action.contentType.replace('_', ' ')}: ${actionResult.error}`
        );
      }
    }

    return new Response(JSON.stringify({ 
      response: finalResponse, 
      modelUsed,
      actionExecuted: actionResult ? {
        success: actionResult.success,
        action: action,
        result: actionResult.result,
        error: actionResult.error
      } : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-chat-with-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I encountered an error while processing your request. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
