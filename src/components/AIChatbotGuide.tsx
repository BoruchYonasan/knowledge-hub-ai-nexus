
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  MessageCircle, 
  Upload, 
  Brain, 
  Settings, 
  FileText, 
  Zap, 
  Shield, 
  Navigation, 
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Users,
  Database,
  Lightbulb,
  Target,
  ArrowRight,
  Star
} from 'lucide-react';

interface AIChatbotGuideProps {
  onNavigate: (page: string) => void;
}

const AIChatbotGuide: React.FC<AIChatbotGuideProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: "Multi-Model AI System",
      description: "Access to Gemini, Claude, and OpenAI models with automatic selection for optimal responses",
      badge: "Advanced"
    },
    {
      icon: Database,
      title: "Persistent Memory",
      description: "Conversations are saved and remembered across sessions for continuous learning",
      badge: "Core"
    },
    {
      icon: Upload,
      title: "File Upload Support",
      description: "Upload documents, PDFs, and text files (up to 10MB) for AI analysis",
      badge: "Pro"
    },
    {
      icon: Settings,
      title: "Content Management",
      description: "Create, edit, and delete content when in management mode",
      badge: "Management"
    },
    {
      icon: Navigation,
      title: "Smart Navigation",
      description: "AI helps you navigate the website and find exactly what you need",
      badge: "Helper"
    },
    {
      icon: Shield,
      title: "Context Awareness",
      description: "Responses are tailored to your current page and role for maximum relevance",
      badge: "Smart"
    }
  ];

  const useCases = [
    {
      title: "Knowledge Discovery",
      description: "Find company policies, procedures, and documentation quickly",
      example: "\"Where can I find the remote work policy?\" or \"Show me the latest safety guidelines\""
    },
    {
      title: "Project Assistance",
      description: "Get help with project planning, task management, and timeline creation",
      example: "\"Help me create a project timeline for the new product launch\""
    },
    {
      title: "Document Analysis",
      description: "Upload files for AI analysis, summarization, and insights",
      example: "Upload a PDF contract and ask \"What are the key terms in this agreement?\""
    },
    {
      title: "Content Creation",
      description: "Generate updates, reports, and documentation with AI assistance",
      example: "\"Create a weekly update about our Q2 marketing initiatives\""
    },
    {
      title: "Navigation Help",
      description: "Get guided assistance on where to find specific information",
      example: "\"I need to submit a time-off request, where do I go?\""
    }
  ];

  const bestPractices = [
    {
      icon: Target,
      title: "Be Specific",
      tip: "Provide clear context and specific questions for better responses"
    },
    {
      icon: FileText,
      title: "Use Files Wisely",
      tip: "Upload relevant documents to give the AI more context for accurate answers"
    },
    {
      icon: MessageCircle,
      title: "Follow Up",
      tip: "Ask follow-up questions to dive deeper into topics"
    },
    {
      icon: Users,
      title: "Leverage Memory",
      tip: "Reference previous conversations - the AI remembers your chat history"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pl-0 lg:pl-64">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Chatbot Guide</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Enhanced AI System</Badge>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Master AeroMail's enhanced AI chatbot - your intelligent assistant for navigation, 
            content management, and knowledge discovery. This guide will help you unlock the full 
            potential of AI-powered productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What is the AI Chatbot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>What is the AI Chatbot?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  The AeroMail AI Chatbot is an advanced conversational assistant powered by multiple AI models 
                  including Gemini, Claude, and OpenAI. It's designed to help you navigate our knowledge base, 
                  find information quickly, and even manage content when you're in management mode.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">💡 Pro Tip</p>
                  <p className="text-blue-700 mt-1">
                    Think of it as your personal AI assistant that knows everything about AeroMail and 
                    can help you work more efficiently. It remembers your conversations and learns your preferences!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                  <span>Getting Started</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">1. Access the Chatbot</h4>
                    <p className="text-sm text-gray-600">
                      Look for the blue chat button in the bottom-right corner of any page. 
                      Click it to open the AI assistant.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2. Start Chatting</h4>
                    <p className="text-sm text-gray-600">
                      Type your question or request in the message box and press Enter or click Send.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">3. Upload Files (Optional)</h4>
                    <p className="text-sm text-gray-600">
                      Use the upload button to attach documents for AI analysis and context.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">4. Continue Conversations</h4>
                    <p className="text-sm text-gray-600">
                      Your conversation history is saved, so you can continue where you left off anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Key Features & Capabilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <feature.icon className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                            <Badge variant="outline" className="text-xs">{feature.badge}</Badge>
                          </div>
                          <p className="text-xs text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span>Common Use Cases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {useCases.map((useCase, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">{useCase.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{useCase.description}</p>
                      <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 italic">
                        Example: {useCase.example}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Management Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  <span>Content Management Mode</span>
                  <Badge className="bg-green-100 text-green-800">Management Feature</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  When you're in management mode (indicated by a green "Content Manager" badge), 
                  the AI gains special powers to help you create, edit, and delete content across the platform.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700">What You Can Manage:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Latest Updates & Announcements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Project Information</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Gantt Chart Items</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Knowledge Base Articles</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700">Example Commands:</h4>
                    <div className="space-y-2 text-xs">
                      <div className="bg-green-50 p-2 rounded">
                        "Create a new project called 'Mobile App Redesign'"
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        "Add a milestone for Q3 product launch on July 15th"
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        "Update the remote work policy article"
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm">Try the Chatbot Now</div>
                  <div className="text-xs text-gray-600">Open any page and click the blue chat button</div>
                </button>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm">Knowledge Base</div>
                  <div className="text-xs text-gray-600">Explore content the AI can help you with</div>
                </button>
                <button
                  onClick={() => onNavigate('project-central')}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm">Project Central</div>
                  <div className="text-xs text-gray-600">See how AI helps with project management</div>
                </button>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Best Practices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <practice.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{practice.title}</div>
                        <div className="text-xs text-gray-600">{practice.tip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-red-600" />
                  <span>Troubleshooting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-gray-900 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span>Chatbot Not Responding?</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Check your internet connection and try refreshing the page.
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-gray-900 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span>File Upload Issues?</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Ensure files are under 10MB and in supported formats (PDF, TXT, MD, etc.).
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-gray-900 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span>Unexpected Responses?</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Be more specific in your questions and provide additional context.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Models */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Models Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gemini 2.0 Flash</span>
                    <Badge variant="outline" className="text-xs">Default</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Claude 3.5 Sonnet</span>
                    <Badge variant="outline" className="text-xs">Advanced</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">GPT-4</span>
                    <Badge variant="outline" className="text-xs">Creative</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    The system automatically chooses the best model for your specific request.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotGuide;
