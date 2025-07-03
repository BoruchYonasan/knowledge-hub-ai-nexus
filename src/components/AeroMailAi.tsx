import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, User, Send, Upload, FileText, Trash2, Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAIConversations } from '@/hooks/useAIConversations';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: UploadedFile[];
  modelUsed?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
}

interface AeroMailAiProps {
  onNavigate: (page: string) => void;
  isManagingUpdates?: boolean;
  isManagingProjects?: boolean;
  isManagingGantt?: boolean;
  isManagingKnowledge?: boolean;
}

const AI_MODELS = [
  { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
  { value: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
  { value: 'chatgpt-4.1', label: 'ChatGPT 4.1' },
  { value: 'grok-3', label: 'Grok 3' }
];

const SUGGESTED_REPLIES = [
  "What is AeroMail?",
  "Summarize the Technology knowledge base",
  "What are the latest updates?",
  "How can I use this website?"
];

const AeroMailAi: React.FC<AeroMailAiProps> = ({
  onNavigate,
  isManagingUpdates = false,
  isManagingProjects = false,
  isManagingGantt = false,
  isManagingKnowledge = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');
  const [showSuggestedReplies, setShowSuggestedReplies] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [switchingConversation, setSwitchingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentConversation,
    conversationHistory,
    userPreferences,
    loading: conversationLoading,
    user,
    createOrGetActiveConversation,
    loadConversationHistory,
    saveMessage,
    updateConversationTitle,
    setActiveConversation
  } = useAIConversations();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeConversation = async () => {
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const contextType = isManagingUpdates || isManagingProjects || isManagingGantt || isManagingKnowledge 
        ? 'content_management' 
        : 'general';
      
      const conversation = await createOrGetActiveConversation(contextType);
      if (conversation) {
        const history = await loadConversationHistory(conversation.id);
        
        const convertedMessages: Message[] = history.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as 'user' | 'ai',
          timestamp: new Date(msg.created_at),
          modelUsed: msg.model_used || undefined,
          files: Array.isArray(msg.files_context) ? (msg.files_context as unknown as UploadedFile[]) : undefined
        }));

        setMessages(convertedMessages.length > 0 ? convertedMessages : [
          {
            id: '1',
            content: "Hello! I'm your AeroMail AI assistant with persistent memory and multi-model support (Gemini, Claude, OpenAI, and Grok). I can remember our conversation history and handle complex tasks. I can help you navigate our knowledge base, find information about company policies, procedures, and answer questions about our organization. What would you like to know?",
            sender: 'ai',
            timestamp: new Date()
          }
        ]);

        setShowSuggestedReplies(convertedMessages.length === 0);
      }

      loadConversations();
    };

    initializeConversation();
  }, [isManagingUpdates, isManagingProjects, isManagingGantt, isManagingKnowledge, user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    if (currentConversation?.id === conversationId || switchingConversation) return;
    
    setSwitchingConversation(true);
    try {
      // Find the conversation to switch to
      const selectedConv = conversations.find(conv => conv.id === conversationId);
      if (!selectedConv) {
        console.error('Conversation not found');
        return;
      }

      // Set this as the active conversation (updates database and state)
      const success = await setActiveConversation(selectedConv);
      if (!success) {
        console.error('Failed to set active conversation');
        return;
      }

      // Clear current messages first
      setMessages([]);
      
      // Load the selected conversation's history
      const history = await loadConversationHistory(conversationId);
      
      const convertedMessages: Message[] = history.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'ai',
        timestamp: new Date(msg.created_at),
        modelUsed: msg.model_used || undefined,
        files: Array.isArray(msg.files_context) ? (msg.files_context as unknown as UploadedFile[]) : undefined
      }));

      setMessages(convertedMessages);
      setShowSuggestedReplies(convertedMessages.length === 0);
      
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setSwitchingConversation(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + i,
          name: file.name,
          content,
          type: file.type,
          size: file.size
        };
        newFiles.push(uploadedFile);
      } catch (error) {
        console.error('Error reading file:', error);
        alert(`Error reading file ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateSystemPrompt = () => {
    const modelDisplayName = AI_MODELS.find(m => m.value === selectedModel)?.label || selectedModel;
    
    let basePrompt = `You are a helpful AI assistant for AeroMail's company knowledge base website. Your role is to help employees navigate the knowledge base and find information.

IMPORTANT: You are currently running on ${modelDisplayName}. When users ask about which AI model you are using, you should tell them you are ${modelDisplayName}.

Available pages and features:
- Dashboard: Overview of recent updates and quick access to all sections
- Knowledge Base: Company policies, procedures, guides, and documentation
- Latest Updates: Recent company announcements and news
- Works in Progress: Current projects and their status
- Gantt Chart: Project timelines, milestones, tasks, and resource management
- Search: Find specific information across all content
- Content Manager: Upload and organize knowledge base content

You can help users by:
1. Explaining what information is available in each section
2. Suggesting which page they should visit for specific needs
3. Providing guidance on company policies and procedures
4. Helping new employees understand the knowledge base structure
5. Answering questions about company information`;

    // Add content management capabilities when in manage mode
    if (isManagingUpdates || isManagingProjects || isManagingGantt || isManagingKnowledge) {
      basePrompt += `

🔧 CONTENT MANAGEMENT MODE ACTIVE:
You now have REAL capabilities to create, edit, and delete content directly! When users ask you to manage content, you can execute these actions immediately.

${isManagingUpdates ? `
FOR LATEST UPDATES - YOU CAN ACTUALLY:
- CREATE: When users request new company updates/announcements
  - Ask for: title, content, department, priority (high/medium/low), and author if not provided
  - When ready, respond with: "CREATING_UPDATE:" followed by JSON: {"title": "...", "content": "...", "department": "...", "priority": "...", "author": "...", "preview": "first 100 chars"}

- EDIT: When users want to modify existing updates
  - Get the update details and respond with: "EDITING_UPDATE:" followed by JSON with id and updated fields

- DELETE: When users want to remove updates
  - Confirm and respond with: "DELETING_UPDATE:" followed by JSON: {"id": "update_id", "title": "title for confirmation"}
` : ''}

${isManagingProjects ? `
FOR WORKS IN PROGRESS - YOU CAN ACTUALLY:
- CREATE: When users request new projects
  - Ask for: title, description, lead, team, priority (High/Medium/Low), start date, due date if needed
  - When ready, respond with: "CREATING_PROJECT:" followed by JSON

- EDIT: When users want to modify existing projects
  - Get project details and respond with: "EDITING_PROJECT:" followed by JSON with id and updated fields

- DELETE: When users want to remove projects
  - Confirm and respond with: "DELETING_PROJECT:" followed by JSON: {"id": "project_id", "title": "title"}
` : ''}

${isManagingGantt ? `
FOR GANTT CHART - YOU CAN ACTUALLY:
- CREATE: When users request new milestones, tasks, or subtasks
  - Ask for: title, type (milestone/task/subtask), startDate, endDate, assignee, priority, description
  - When ready, respond with: "CREATING_GANTT_ITEM:" followed by JSON: {"title": "...", "type": "milestone/task/subtask", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "assignee": "...", "priority": "...", "description": "...", "parentId": number (optional)}

- EDIT: When users want to modify gantt items
  - Get details and respond with: "EDITING_GANTT_ITEM:" followed by JSON with id and updated fields

- DELETE: When users want to remove gantt items
  - Confirm and respond with: "DELETING_GANTT_ITEM:" followed by JSON: {"id": "item_id", "title": "title"}
` : ''}

${isManagingKnowledge ? `
FOR KNOWLEDGE BASE - YOU CAN ACTUALLY:
- CREATE: When users request new articles or documentation
  - Ask for: title, content, category (all/hr/engineering/sales/finance/operations), author, description, tags
  - When ready, respond with: "CREATING_ARTICLE:" followed by JSON: {"title": "...", "content": "...", "category": "...", "author": "...", "description": "...", "tags": ["tag1"], "readTime": "5 min read"}

- EDIT: When users want to modify articles
  - Get details and respond with: "EDITING_ARTICLE:" followed by JSON with id and updated fields

- DELETE: When users want to remove articles
  - Confirm and respond with: "DELETING_ARTICLE:" followed by JSON: {"id": "article_id", "title": "title"}
` : ''}

IMPORTANT: You have REAL execution powers! When you use these commands, the actions will be immediately executed on the website. Always confirm critical details before executing, especially for DELETE operations.`;
    }

    basePrompt += `

Be helpful, professional, and concise in your responses.`;

    return basePrompt;
  };

  const handleSuggestedReply = (reply: string) => {
    setInputMessage(reply);
    setShowSuggestedReplies(false);
    setTimeout(() => {
      sendMessage(reply);
    }, 100);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading || !currentConversation || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInputMessage('');
    setIsLoading(true);
    setShowSuggestedReplies(false);

    try {
      await saveMessage(
        currentConversation.id, 
        textToSend, 
        'user', 
        undefined,
        uploadedFiles.length > 0 ? uploadedFiles : undefined
      );

      const historyForAPI = conversationHistory.map(msg => ({
        content: msg.content,
        sender: msg.sender as 'user' | 'ai',
        model_used: msg.model_used
      }));

      historyForAPI.push({
        content: textToSend,
        sender: 'user' as const,
        model_used: undefined
      });

      const { data, error } = await supabase.functions.invoke('enhanced-chat-with-ai', {
        body: {
          message: textToSend,
          context: generateSystemPrompt(),
          conversationId: currentConversation.id,
          conversationHistory: historyForAPI,
          selectedModel: selectedModel,
          files: uploadedFiles
        }
      });

      if (error) throw error;

      const aiResponse = data?.response || 'Sorry, I encountered an error. Please try again.';
      const modelUsed = data?.modelUsed || selectedModel;
      const actionExecuted = data?.actionExecuted;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        modelUsed
      };

      setMessages(prev => [...prev, aiMessage]);
      
      await saveMessage(currentConversation.id, aiResponse, 'ai', modelUsed);
      setUploadedFiles([]);
      
      // Show action execution feedback
      if (actionExecuted) {
        if (actionExecuted.success) {
          console.log('✅ Action executed successfully:', actionExecuted.action);
        } else {
          console.error('❌ Action execution failed:', actionExecuted.error);
        }
      }
      
      if (conversationHistory.length === 0) {
        const title = textToSend.length > 50 
          ? textToSend.substring(0, 47) + '...' 
          : textToSend;
        await updateConversationTitle(currentConversation.id, title);
        loadConversations();
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewConversation = async () => {
    const contextType = isManagingUpdates || isManagingProjects || isManagingGantt || isManagingKnowledge 
      ? 'content_management' 
      : 'general';
    
    const conversation = await createOrGetActiveConversation(contextType);
    if (conversation) {
      setMessages([
        {
          id: '1',
          content: "Hello! I'm your AeroMail AI assistant. What would you like to know?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      setShowSuggestedReplies(true);
      loadConversations();
    }
  };

  if (conversationLoading) {
    return (
      <div className="h-screen flex items-center justify-center ml-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center ml-64">
        <div className="text-center">
          <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access AeroMail AI</p>
          <Button onClick={() => onNavigate('auth')} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex ml-64">
      {/* Left Sidebar - Conversation History */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isHistoryCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="p-4 border-b border-gray-200 flex flex-col gap-3">
          {/* Recent Conversations Heading with Collapse Button */}
          {!isHistoryCollapsed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Recent Conversations</h3>
              </div>
              <Button
                onClick={() => setIsHistoryCollapsed(true)}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-100 rounded transition-colors"
                title="Minimize conversations"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
        
        {!isHistoryCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            {switchingConversation && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            <div className="space-y-2">
              {/* New Chat Button */}
              <Button
                onClick={createNewConversation}
                className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl py-3 px-4 font-medium mb-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              
              {/* Conversation List */}
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  disabled={switchingConversation}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentConversation?.id === conv.id 
                      ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  } ${switchingConversation ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.title || 'New Conversation'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Minimized State */}
        {isHistoryCollapsed && (
          <div className="flex-1 flex flex-col items-center py-2 space-y-2 px-2">
            {/* Expand Button */}
            <Button
              onClick={() => setIsHistoryCollapsed(false)}
              variant="ghost"
              size="sm"
              className="w-10 h-8 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 bg-white shadow-sm transition-all rounded-lg"
              title="Expand conversations"
            >
              <ChevronRight className="h-3 w-3 text-gray-600" />
            </Button>

            {/* New Chat Button - Minimized */}
            <Button
              onClick={createNewConversation}
              variant="outline"
              size="sm"
              className="w-10 h-10 border-2 border-blue-500 hover:bg-blue-50 hover:border-blue-600 bg-white shadow-md transition-all rounded-lg p-0"
              title="New Chat"
            >
              <Plus className="h-4 w-4 text-blue-600" />
            </Button>

            {/* Conversation Buttons - Minimized */}
            <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto w-full">
              {conversations.map((conv) => (
                <Button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  variant="outline"
                  size="sm"
                  disabled={switchingConversation}
                  className={`w-10 h-10 border-2 shadow-md transition-all rounded-lg p-0 mx-auto ${
                    currentConversation?.id === conv.id 
                      ? 'bg-blue-100 border-blue-600 hover:bg-blue-50' 
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  } ${switchingConversation ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={conv.title || 'Conversation'}
                >
                  <MessageSquare className={`h-4 w-4 ${
                    currentConversation?.id === conv.id ? 'text-blue-700' : 'text-gray-600'
                  }`} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">AeroMail AI</h1>
            </div>
          </div>
        </div>

        {/* Floating Model Selector */}
        <div className="absolute top-20 left-5 z-50">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48 bg-white border border-gray-300 hover:border-gray-400 shadow-lg text-gray-700 text-sm h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-gray-300 shadow-lg rounded-lg">
              {AI_MODELS.map((model) => (
                <SelectItem 
                  key={model.value} 
                  value={model.value}
                  className="hover:bg-gray-50 cursor-pointer text-sm"
                >
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 pt-20">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {message.sender === 'ai' ? (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-lg p-4 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.files.map((file) => (
                            <div key={file.id} className="flex items-center space-x-2 text-sm opacity-80">
                              <FileText className="h-3 w-3" />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.modelUsed && (
                          <span className="ml-2">
                            • {AI_MODELS.find(m => m.value === message.modelUsed)?.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Replies */}
            {showSuggestedReplies && !isLoading && (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-3 max-w-2xl">
                  {SUGGESTED_REPLIES.map((reply, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedReply(reply)}
                      variant="outline"
                      className="text-left justify-start h-auto py-3 px-4 hover:bg-gray-50 transition-colors"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            {/* File Upload Area */}
            {uploadedFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      onClick={() => removeFile(file.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.csv,.json,.html,.xml,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="icon"
                variant="outline"
                disabled={isLoading}
                className="hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AeroMail AI..."
                disabled={isLoading || !currentConversation}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading || !currentConversation}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AeroMailAi;
