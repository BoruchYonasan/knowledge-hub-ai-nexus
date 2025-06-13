import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Bot, User, Bell } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  knowledgeBaseContext: string;
  onNavigate: (page: string) => void;
  onCreateUpdate?: (update: any) => void;
  onEditUpdate?: (update: any) => void;
  onDeleteUpdate?: (updateId: number, title: string) => void;
  onCreateProject?: (project: any) => void;
  onEditProject?: (project: any) => void;
  onDeleteProject?: (projectId: number, title: string) => void;
  onCreateGanttItem?: (item: any) => void;
  onEditGanttItem?: (item: any) => void;
  onDeleteGanttItem?: (itemId: number, title: string) => void;
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
      content: "Hello! I'm your AeroMail knowledge base assistant. I can help you navigate our knowledge base, find information about company policies, procedures, and answer questions about our organization. I can also help manage content when you're in manage mode. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && hasNewMessage && onMessageRead) {
      onMessageRead();
    }
  }, [isOpen, hasNewMessage, onMessageRead]);

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

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyDoWesZjkIrFmzfBaWs-vHk7FOJyjDaG5M', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${generateSystemPrompt()}\n\nUser: ${inputMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
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
      
      // Trigger notification for new AI message
      if (!isOpen && onNewMessage) {
        onNewMessage();
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
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <Bell className="h-2 w-2 text-white" />
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-40 flex flex-col">
          <CardHeader className="pb-2">
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
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
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

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
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
