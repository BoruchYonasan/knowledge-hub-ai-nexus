import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Upload, FileText, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
}

interface AIAssistantProps {
  knowledgeBaseContext: string;
  onNavigate: (page: string) => void;
  onCreateUpdate?: (update: any) => void;
  onEditUpdate?: (update: any) => void;
  onDeleteUpdate?: (updateId: string, title: string) => void;
  onCreateProject?: (project: any) => void;
  onEditProject?: (project: any) => void;
  onDeleteProject?: (projectId: string, title: string) => void;
  onCreateGanttItem?: (item: any) => void;
  onEditGanttItem?: (item: any) => void;
  onDeleteGanttItem?: (itemId: string, title: string) => void;
  isManagingUpdates?: boolean;
  isManagingProjects?: boolean;
  isManagingGantt?: boolean;
  onNewMessage?: () => void;
  hasNewMessage?: boolean;
  onMessageRead?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  knowledgeBaseContext, 
  onNavigate, 
  onCreateUpdate,
  onEditUpdate,
  onDeleteUpdate,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onCreateGanttItem,
  onEditGanttItem,
  onDeleteGanttItem,
  isManagingUpdates = false,
  isManagingProjects = false,
  isManagingGantt = false,
  onNewMessage,
  hasNewMessage = false,
  onMessageRead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AeroMail knowledge base assistant. I can help you navigate our knowledge base, find information about company policies, procedures, and answer questions about our organization. I can also help manage content when you're in manage mode. You can now upload files to share large contexts with me. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && hasUnreadMessage && onMessageRead) {
      setHasUnreadMessage(false);
      onMessageRead();
    }
  }, [isOpen, hasUnreadMessage, onMessageRead]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (limit to 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Only accept text files, PDFs, and common document formats
      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/json',
        'text/html',
        'text/xml',
        'application/pdf'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|csv|json|html|xml|pdf)$/i)) {
        alert(`File type ${file.type} is not supported. Please upload text files, PDFs, or documents.`);
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
    
    // Clear the input
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
    let basePrompt = `You are a helpful AI assistant for AeroMail's company knowledge base website. Your role is to help employees navigate the knowledge base and find information.

Current context: ${knowledgeBaseContext}

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
    if (isManagingUpdates || isManagingProjects || isManagingGantt) {
      basePrompt += `

CONTENT MANAGEMENT MODE ACTIVE:
You can now help create, edit, and delete content directly! When the user asks you to manage content:

${isManagingUpdates ? `
FOR LATEST UPDATES:
- CREATE: Listen for requests to create company updates/announcements
  - Ask for: title, content, department, priority (high/medium/low), and author if not provided
  - When you have enough information, respond with: "CREATING_UPDATE:" followed by a JSON object
  - JSON format: {"title": "...", "content": "...", "department": "...", "priority": "...", "author": "...", "preview": "first 100 chars of content"}

- EDIT: Listen for requests to edit existing updates
  - When you have the information, respond with: "EDITING_UPDATE:" followed by a JSON object

- DELETE: Listen for requests to delete updates
  - When confirmed, respond with: "DELETING_UPDATE:" followed by a JSON object
` : ''}

${isManagingProjects ? `
FOR WORKS IN PROGRESS:
- CREATE: Listen for requests to create new projects
  - Ask for: title, description, lead, team, priority (High/Medium/Low), start date, due date if not provided
  - When you have enough information, respond with: "CREATING_PROJECT:" followed by a JSON object

- EDIT: Listen for requests to edit existing projects
  - When you have the information, respond with: "EDITING_PROJECT:" followed by a JSON object

- DELETE: Listen for requests to delete projects
  - When confirmed, respond with: "DELETING_PROJECT:" followed by a JSON object
` : ''}

${isManagingGantt ? `
FOR GANTT CHART:
- CREATE: Listen for requests to create milestones, tasks, or subtasks
  - Ask for: title, type (milestone/task/subtask), startDate, endDate, assignee, priority (High/Medium/Low), description if not provided
  - When you have enough information, respond with: "CREATING_GANTT_ITEM:" followed by a JSON object
  - JSON format: {"title": "...", "type": "milestone/task/subtask", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "assignee": "...", "priority": "...", "description": "...", "parentId": number (optional for subtasks)}

- EDIT: Listen for requests to edit existing gantt items
  - When you have the information, respond with: "EDITING_GANTT_ITEM:" followed by a JSON object
  - JSON format: {"id": itemId, "title": "...", "startDate": "...", "endDate": "...", "progress": number, "status": "Not Started/In Progress/Completed/On Hold", etc.}

- DELETE: Listen for requests to delete gantt items
  - When confirmed, respond with: "DELETING_GANTT_ITEM:" followed by a JSON object
  - JSON format: {"id": itemId, "title": "title for confirmation"}
` : ''}

Always confirm the details before creating, editing, or deleting content and be helpful in gathering missing information.`;
    }

    basePrompt += `

Be helpful, professional, and concise in your responses.`;

    return basePrompt;
  };

  const buildContextWithFiles = () => {
    let context = generateSystemPrompt();
    
    if (uploadedFiles.length > 0) {
      context += `\n\nUPLOADED FILES CONTEXT:\n`;
      uploadedFiles.forEach(file => {
        context += `\n--- FILE: ${file.name} (${formatFileSize(file.size)}) ---\n`;
        context += file.content;
        context += `\n--- END OF FILE: ${file.name} ---\n`;
      });
      context += `\nPlease use the information from these uploaded files to provide more accurate and detailed responses.`;
    }
    
    return context;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-0605:generateContent?key=AIzaSyDoWesZjkIrFmzfBaWs-vHk7FOJyjDaG5M', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${buildContextWithFiles()}\n\nUser: ${inputMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I encountered an error. Please try again.';

      // Handle content management responses
      if (aiResponse.includes('CREATING_UPDATE:') && onCreateUpdate) {
        const jsonStart = aiResponse.indexOf('CREATING_UPDATE:') + 'CREATING_UPDATE:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const updateData = JSON.parse(jsonStr);
          onCreateUpdate(updateData);
          aiResponse = `✅ I've created the update "${updateData.title}" for you! It should now appear in the Latest Updates section.`;
        } catch (error) {
          console.error('Error parsing update JSON:', error);
          aiResponse = 'I had trouble creating that update. Please provide the details again.';
        }
      } 
      else if (aiResponse.includes('EDITING_UPDATE:') && onEditUpdate) {
        const jsonStart = aiResponse.indexOf('EDITING_UPDATE:') + 'EDITING_UPDATE:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const updateData = JSON.parse(jsonStr);
          onEditUpdate(updateData);
          aiResponse = `✅ I've updated the update "${updateData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing update JSON:', error);
          aiResponse = 'I had trouble editing that update. Please provide the details again.';
        }
      } else if (aiResponse.includes('DELETING_UPDATE:') && onDeleteUpdate) {
        const jsonStart = aiResponse.indexOf('DELETING_UPDATE:') + 'DELETING_UPDATE:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const deleteData = JSON.parse(jsonStr);
          onDeleteUpdate(deleteData.id, deleteData.title);
          aiResponse = `✅ I've deleted the update "${deleteData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing delete JSON:', error);
          aiResponse = 'I had trouble deleting that update. Please specify which update to delete.';
        }
      } else if (aiResponse.includes('CREATING_PROJECT:') && onCreateProject) {
        const jsonStart = aiResponse.indexOf('CREATING_PROJECT:') + 'CREATING_PROJECT:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const projectData = JSON.parse(jsonStr);
          onCreateProject(projectData);
          aiResponse = `✅ I've created the project "${projectData.title}" for you! It should now appear in the Works in Progress section.`;
        } catch (error) {
          console.error('Error parsing project JSON:', error);
          aiResponse = 'I had trouble creating that project. Please provide the details again.';
        }
      } else if (aiResponse.includes('EDITING_PROJECT:') && onEditProject) {
        const jsonStart = aiResponse.indexOf('EDITING_PROJECT:') + 'EDITING_PROJECT:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const projectData = JSON.parse(jsonStr);
          onEditProject(projectData);
          aiResponse = `✅ I've updated the project "${projectData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing project JSON:', error);
          aiResponse = 'I had trouble editing that project. Please provide the details again.';
        }
      } else if (aiResponse.includes('DELETING_PROJECT:') && onDeleteProject) {
        const jsonStart = aiResponse.indexOf('DELETING_PROJECT:') + 'DELETING_PROJECT:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const deleteData = JSON.parse(jsonStr);
          onDeleteProject(deleteData.id, deleteData.title);
          aiResponse = `✅ I've deleted the project "${deleteData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing delete JSON:', error);
          aiResponse = 'I had trouble deleting that project. Please specify which project to delete.';
        }
      } else if (aiResponse.includes('CREATING_GANTT_ITEM:') && onCreateGanttItem) {
        const jsonStart = aiResponse.indexOf('CREATING_GANTT_ITEM:') + 'CREATING_GANTT_ITEM:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const itemData = JSON.parse(jsonStr);
          onCreateGanttItem(itemData);
          aiResponse = `✅ I've created the ${itemData.type} "${itemData.title}" for you! It should now appear in the Gantt Chart section.`;
        } catch (error) {
          console.error('Error parsing gantt item JSON:', error);
          aiResponse = 'I had trouble creating that gantt item. Please provide the details again.';
        }
      } else if (aiResponse.includes('EDITING_GANTT_ITEM:') && onEditGanttItem) {
        const jsonStart = aiResponse.indexOf('EDITING_GANTT_ITEM:') + 'EDITING_GANTT_ITEM:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const itemData = JSON.parse(jsonStr);
          onEditGanttItem(itemData);
          aiResponse = `✅ I've updated the gantt item "${itemData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing gantt item JSON:', error);
          aiResponse = 'I had trouble editing that gantt item. Please provide the details again.';
        }
      } else if (aiResponse.includes('DELETING_GANTT_ITEM:') && onDeleteGanttItem) {
        const jsonStart = aiResponse.indexOf('DELETING_GANTT_ITEM:') + 'DELETING_GANTT_ITEM:'.length;
        const jsonStr = aiResponse.substring(jsonStart).trim();
        try {
          const deleteData = JSON.parse(jsonStr);
          onDeleteGanttItem(deleteData.id, deleteData.title);
          aiResponse = `✅ I've deleted the gantt item "${deleteData.title}" for you!`;
        } catch (error) {
          console.error('Error parsing delete JSON:', error);
          aiResponse = 'I had trouble deleting that gantt item. Please specify which item to delete.';
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Clear uploaded files after successful message
      setUploadedFiles([]);
      
      // Show notification for new AI message if chat is closed
      if (!isOpen) {
        setHasUnreadMessage(true);
        if (onNewMessage) {
          onNewMessage();
        }
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Show notification for error message if chat is closed
      if (!isOpen) {
        setHasUnreadMessage(true);
        if (onNewMessage) {
          onNewMessage();
        }
      }
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getButtonColor = () => {
    if (isManagingUpdates || isManagingProjects || isManagingGantt) {
      return 'bg-green-600 hover:bg-green-700';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <>
      {/* Chat Toggle Button with Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg relative ${getButtonColor()}`}
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {(hasUnreadMessage || hasNewMessage) && !isOpen && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-xl z-40 flex flex-col">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AeroMail AI Assistant</span>
              {(isManagingUpdates || isManagingProjects || isManagingGantt) && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Content Manager
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 break-words ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.files.map((file) => (
                              <div key={file.id} className="flex items-center space-x-2 text-xs opacity-80">
                                <FileText className="h-3 w-3" />
                                <span>{file.name} ({formatFileSize(file.size)})</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* File Upload Area */}
            {uploadedFiles.length > 0 && (
              <div className="border-t p-2 flex-shrink-0 max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFile(file.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex space-x-2">
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
                  className="flex-shrink-0"
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isManagingUpdates || isManagingProjects || isManagingGantt
                      ? "Tell me what content to create, edit, or delete..." 
                      : "Ask me about AeroMail's knowledge base..."
                  }
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
