import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { filesAPI } from '../utils/api';

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI health assistant. I can help you understand your medical reports, answer health questions, and provide guidance. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user reports when assistant opens
  useEffect(() => {
    if (isOpen) {
      fetchUserReports();
    }
  }, [isOpen]);

  const fetchUserReports = async () => {
    try {
      const response = await filesAPI.getUserReports();
      if (response.success) {
        setUserReports(response.data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch user reports:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate AI response (you can replace this with real AI API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateAIResponse(inputText),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Get recent reports data
    const recentReports = userReports.slice(0, 3);
    const reportCount = userReports.length;
    const familyReports = userReports.filter(r => r.familyMember);
    const selfReports = userReports.filter(r => !r.familyMember);
    
    if (input.includes('report') || input.includes('analysis')) {
      if (reportCount === 0) {
        return 'I don\'t see any medical reports in your account yet. You can upload reports from the "Upload Report" page, and I\'ll be able to provide detailed analysis and insights!';
      }
      
      let response = `I can see you have ${reportCount} medical report${reportCount > 1 ? 's' : ''} in your account. `;
      
      if (recentReports.length > 0) {
        const latestReport = recentReports[0];
        response += `Your most recent report is "${latestReport.fileName}" (${latestReport.reportType}). `;
        
        if (latestReport.aiInsight) {
          response += `Based on the AI analysis, I can help explain any specific values or provide recommendations. `;
        }
      }
      
      response += 'Would you like me to explain any specific report or provide health recommendations?';
      return response;
    }
    
    if (input.includes('diet') || input.includes('food') || input.includes('nutrition')) {
      let response = 'For optimal health, I recommend:\n• Including iron-rich foods like spinach and lean meats\n• Avoiding processed foods with high sodium\n• Eating green leafy vegetables for vitamins\n• Maintaining a balanced diet with lean proteins\n\n';
      
      if (recentReports.length > 0) {
        const hasAnalysis = recentReports.some(r => r.aiInsight?.foodRecommendations);
        if (hasAnalysis) {
          response += 'Based on your recent reports, I can provide personalized dietary recommendations. Would you like me to analyze your specific nutritional needs?';
        }
      }
      
      return response;
    }
    
    if (input.includes('doctor') || input.includes('question')) {
      let response = 'Here are some important questions to ask your doctor:\n• How is your overall energy level?\n• Are you experiencing any fatigue or weakness?\n• Have you noticed any changes in your appetite?\n\n';
      
      if (recentReports.length > 0) {
        const hasQuestions = recentReports.some(r => r.aiInsight?.doctorQuestions);
        if (hasQuestions) {
          response += 'Based on your recent reports, I can suggest specific questions tailored to your health status. Would you like me to generate personalized questions for your next doctor visit?';
        }
      }
      
      return response;
    }
    
    if (input.includes('family') || input.includes('member')) {
      if (familyReports.length > 0) {
        const familyNames = familyReports.map(r => r.familyMember.name).join(', ');
        return `I can see you're tracking health for your family members: ${familyNames}. I can help you manage their health records, analyze their reports, and provide family-specific health guidance. What would you like to know about your family's health?`;
      } else {
        return 'I can help you manage your family\'s health records! You can add family members from the "Family" page, and I\'ll be able to track their reports and provide family-specific health insights.';
      }
    }
    
    if (input.includes('summary') || input.includes('overview')) {
      if (reportCount === 0) {
        return 'You don\'t have any medical reports yet. Upload some reports to get a comprehensive health overview!';
      }
      
      let response = `Here's your health overview:\n• Total Reports: ${reportCount}\n• Self Reports: ${selfReports.length}\n• Family Reports: ${familyReports.length}\n\n`;
      
      if (recentReports.length > 0) {
        response += 'Recent Reports:\n';
        recentReports.forEach((report, index) => {
          response += `${index + 1}. ${report.fileName} (${report.reportType})\n`;
        });
      }
      
      return response;
    }
    
    if (input.includes('health') || input.includes('wellness')) {
      return 'Maintaining good health involves:\n• Regular exercise\n• Balanced nutrition\n• Adequate sleep\n• Stress management\n• Regular health checkups\n\nBased on your medical reports, I can provide personalized wellness recommendations. Would you like specific advice on any of these areas?';
    }
    
    return 'Thank you for your question! I\'m here to help with health-related queries, medical report analysis, and wellness guidance. I can see your health data and provide personalized insights. Could you please be more specific about what you\'d like to know?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[40vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">AI Health Assistant</h3>
              <p className="text-xs sm:text-sm text-gray-500">Your personal health companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-1 sm:space-x-2">
                  {message.type === 'bot' && (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white mt-0.5 sm:mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex space-x-1 sm:space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your health..."
              className="flex-1 px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
