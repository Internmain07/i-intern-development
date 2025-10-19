import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ThumbsUp, ThumbsDown, Mail, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  isWelcome?: boolean;
}

interface ChatIntent {
  id: string;
  title: string;
  response: string;
  followUp?: string[];
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatIntents: ChatIntent[] = [
    {
      id: 'resume-build',
      title: 'How do I build my resume?',
      response: 'Building a strong resume involves several key steps:\n\n• Choose a clean, professional template\n• Include contact info, objective, education, experience, and skills\n• Use action verbs and quantify achievements\n• Tailor it to each internship application\n• Keep it to 1-2 pages maximum\n\nOur Resume Builder tool can guide you through each section step-by-step!',
      followUp: ['Resume sections help', 'Resume templates', 'Common resume mistakes', 'Back to main menu']
    },
    {
      id: 'find-internships',
      title: 'Where do I apply for internships?',
      response: 'You can find internship opportunities in several places:\n\n• I-Intern job board (your best starting point!)\n• Company websites directly\n• LinkedIn and Indeed\n• University career centers\n• Industry-specific job boards\n• Professional networking events\n\nStart with our platform - we have pre-screened opportunities perfect for students!',
      followUp: ['How to search effectively', 'Application tips', 'Interview preparation', 'Back to main menu']
    },
    {
      id: 'ai-test',
      title: 'What is the AI test?',
      response: 'The AI Assessment is our intelligent screening tool that helps match you with suitable internships:\n\n• Takes 10-15 minutes to complete\n• Tests relevant skills for your field\n• Provides personalized recommendations\n• Helps employers find qualified candidates\n• Can be retaken after 30 days\n\nComplete it in your profile section to unlock premium opportunities!',
      followUp: ['Test preparation tips', 'How scoring works', 'Retaking the test', 'Back to main menu']
    },
    {
      id: 'employer-posting',
      title: 'How do employers post internships?',
      response: 'Employers can easily post internships on I-Intern:\n\n• Create a company account\n• Verify business credentials\n• Post detailed job descriptions\n• Set screening requirements\n• Review AI-matched candidates\n• Manage applications through our dashboard\n\nWe ensure quality by vetting all employer accounts before approval.',
      followUp: ['Employer verification process', 'Posting guidelines', 'Contact employer support', 'Back to main menu']
    },
    {
      id: 'track-application',
      title: 'How to track my application?',
      response: 'Track your applications easily in your dashboard:\n\n• Visit "My Applications" section\n• View status: Applied, Under Review, Interview, Offer, or Rejected\n• Get email notifications for status changes\n• See application timestamps\n• Download application history\n\nEmployers typically respond within 5-7 business days.',
      followUp: ['Application status meanings', 'Following up with employers', 'Notification settings', 'Back to main menu']
    },
    {
      id: 'application-status',
      title: 'Understanding application status',
      response: 'Here\'s what each application status means:\n\n• **Applied**: Successfully submitted\n• **Under Review**: Employer is evaluating\n• **Interview**: You\'ve been selected for interview\n• **Offer**: Congratulations! Job offer extended\n• **On Hold**: Temporarily paused\n• **Rejected**: Not selected this time\n\nDon\'t get discouraged by rejections - they\'re part of the process!',
      followUp: ['Improving applications', 'Interview tips', 'Handling rejection', 'Back to main menu']
    },
    {
      id: 'employer-dashboard',
      title: 'Employer dashboard help',
      response: 'Employers have access to powerful dashboard features:\n\n• Post and manage job listings\n• Review AI-matched candidates\n• Schedule interviews\n• Send offers and communications\n• Track hiring metrics\n• Access candidate profiles and assessments\n\nNeed help with employer features? Contact our business support team.',
      followUp: ['Posting jobs effectively', 'Candidate matching', 'Contact business support', 'Back to main menu']
    },
    {
      id: 'resume-sections',
      title: 'Section-by-section resume tips',
      response: 'Let me break down each resume section:\n\n**Header**: Name, phone, email, LinkedIn, portfolio\n**Objective**: 1-2 lines about your career goals\n**Education**: Degree, school, GPA (if 3.5+), graduation date\n**Experience**: Jobs, internships, volunteer work with achievements\n**Skills**: Technical and soft skills relevant to the role\n**Projects**: Academic or personal projects showing your abilities',
      followUp: ['Header best practices', 'Writing objectives', 'Skills section tips', 'Back to main menu']
    },
    {
      id: 'interview-prep',
      title: 'Interview preparation tips',
      response: 'Ace your internship interviews with these tips:\n\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare STAR method examples\n• Dress professionally\n• Arrive 10-15 minutes early\n• Bring copies of your resume\n• Prepare thoughtful questions to ask\n\nRemember: they already like your application, now show your personality!',
      followUp: ['Common interview questions', 'What to wear', 'Questions to ask', 'Back to main menu']
    },
    {
      id: 'networking-tips',
      title: 'Professional networking advice',
      response: 'Build your professional network effectively:\n\n• Optimize your LinkedIn profile\n• Attend virtual and in-person events\n• Join industry-specific groups\n• Reach out to alumni in your field\n• Follow up with new connections\n• Offer value, don\'t just ask for help\n• Be genuine and authentic in interactions',
      followUp: ['LinkedIn optimization', 'Networking events', 'Alumni connections', 'Back to main menu']
    },
    {
      id: 'cover-letter',
      title: 'Writing effective cover letters',
      response: 'Craft compelling cover letters:\n\n• Address hiring manager by name if possible\n• Open with enthusiasm for the specific role\n• Highlight 2-3 relevant achievements\n• Show knowledge of the company\n• Keep it to one page\n• End with a strong call to action\n• Proofread carefully for errors',
      followUp: ['Cover letter templates', 'Research techniques', 'Common mistakes', 'Back to main menu']
    },
    {
      id: 'salary-negotiation',
      title: 'Internship compensation guide',
      response: 'Understanding internship compensation:\n\n• Research market rates for your field/location\n• Consider total package (pay, benefits, learning)\n• Many internships are unpaid but offer valuable experience\n• Paid internships typically range $12-25/hour\n• Don\'t negotiate until you have an offer\n• Be grateful but professional in discussions',
      followUp: ['Research salary data', 'Negotiation tactics', 'Non-monetary benefits', 'Back to main menu']
    },
    {
      id: 'technical-skills',
      title: 'Developing technical skills',
      response: 'Boost your technical abilities:\n\n• Identify skills needed in your target field\n• Take online courses (Coursera, Udemy, edX)\n• Work on personal projects\n• Contribute to open source projects\n• Build a portfolio showcasing your work\n• Get relevant certifications\n• Practice coding challenges if in tech',
      followUp: ['Popular online courses', 'Portfolio building', 'Certification programs', 'Back to main menu']
    },
    {
      id: 'remote-internships',
      title: 'Remote internship success',
      response: 'Excel in remote internship roles:\n\n• Set up a dedicated workspace\n• Maintain regular communication\n• Be proactive about asking questions\n• Meet all deadlines consistently\n• Participate actively in virtual meetings\n• Use collaboration tools effectively\n• Schedule regular check-ins with supervisor',
      followUp: ['Remote work tools', 'Communication tips', 'Time management', 'Back to main menu']
    },
    {
      id: 'account-settings',
      title: 'Account and profile settings',
      response: 'Manage your I-Intern account:\n\n• Update profile information regularly\n• Upload a professional photo\n• Complete all profile sections\n• Set notification preferences\n• Update your resume and portfolio\n• Review privacy settings\n• Enable two-factor authentication for security',
      followUp: ['Profile optimization', 'Privacy settings', 'Notification preferences', 'Back to main menu']
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: 'Hi! I\'m your I-Intern Assistant 👋\n\nI\'m here to help you navigate your internship journey. What would you like to know about?',
      options: chatIntents.slice(0, 8).map(intent => intent.title).concat(['More topics →']),
      isWelcome: true
    };
    setMessages([welcomeMessage]);
    setSessionEnded(false);
    setShowFeedback(false);
  };

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option
    };

    if (option === 'More topics →') {
      const moreTopicsMessage: Message = {
        id: Date.now().toString() + '_more',
        type: 'bot',
        content: 'Here are more topics I can help you with:',
        options: chatIntents.slice(8).map(intent => intent.title).concat(['← Back to main topics'])
      };
      setMessages(prev => [...prev, userMessage, moreTopicsMessage]);
      return;
    }

    if (option === '← Back to main topics') {
      const mainTopicsMessage: Message = {
        id: Date.now().toString() + '_main',
        type: 'bot',
        content: 'Here are the main topics I can help you with:',
        options: chatIntents.slice(0, 8).map(intent => intent.title).concat(['More topics →'])
      };
      setMessages(prev => [...prev, userMessage, mainTopicsMessage]);
      return;
    }

    if (option === 'Back to main menu') {
      const mainMenuMessage: Message = {
        id: Date.now().toString() + '_menu',
        type: 'bot',
        content: 'What else would you like to know about?',
        options: chatIntents.slice(0, 8).map(intent => intent.title).concat(['More topics →', 'End conversation'])
      };
      setMessages(prev => [...prev, userMessage, mainMenuMessage]);
      return;
    }

    if (option === 'End conversation') {
      const endMessage: Message = {
        id: Date.now().toString() + '_end',
        type: 'bot',
        content: 'Thank you for using I-Intern Assistant! I hope I was helpful. 😊'
      };
      setMessages(prev => [...prev, userMessage, endMessage]);
      setSessionEnded(true);
      setShowFeedback(true);
      return;
    }

    if (option === 'Talk to Human') {
      const humanMessage: Message = {
        id: Date.now().toString() + '_human',
        type: 'bot',
        content: 'I\'ll connect you with our support team! You can reach us at:\n\n📧 support@i-intern.com\n📞 1-800-INTERN-1\n\nOr click below to send an email directly.',
        options: ['Send Email', 'Back to main menu']
      };
      setMessages(prev => [...prev, userMessage, humanMessage]);
      return;
    }

    if (option === 'Send Email') {
      window.location.href = 'mailto:support@i-intern.com?subject=I-Intern Support Request';
      return;
    }

    // Find matching intent
    const intent = chatIntents.find(i => i.title === option);
    if (intent) {
      const botResponse: Message = {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: intent.response,
        options: intent.followUp || ['Back to main menu', 'End conversation']
      };
      setMessages(prev => [...prev, userMessage, botResponse]);
    } else {
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString() + '_fallback',
        type: 'bot',
        content: 'I didn\'t get that. Please choose from the options below.',
        options: chatIntents.slice(0, 8).map(intent => intent.title).concat(['More topics →', 'Talk to Human'])
      };
      setMessages(prev => [...prev, userMessage, fallbackMessage]);
    }
  };

  const handleFeedback = (positive: boolean) => {
    const feedbackMessage: Message = {
      id: Date.now().toString() + '_feedback',
      type: 'bot',
      content: positive 
        ? 'Thank you for the positive feedback! 🎉 Feel free to start a new conversation anytime.'
        : 'Thank you for the feedback. We\'ll work on improving! You can also contact our human support team for more help.'
    };
    setMessages(prev => [...prev, feedbackMessage]);
    setShowFeedback(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      initializeChat();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowFeedback(false);
    setSessionEnded(false);
    initializeChat();
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          style={{ backgroundColor: '#008080' }}
          aria-label="Open chat assistant"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-lg shadow-2xl z-40 flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 rounded-t-lg flex items-center justify-between" style={{ backgroundColor: '#008080' }}>
            <div>
              <h3 className="font-semibold" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                I-Intern Assistant
              </h3>
              <p className="text-xs opacity-90" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Here to help with your internship journey
              </p>
            </div>
            <button onClick={resetChat} className="hover:bg-teal-500 p-1 rounded" aria-label="Reset chat">
              <User size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#FDF5E6' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-teal-600 text-white ml-4'
                    : 'bg-white shadow-sm border mr-4'
                }`} style={{ 
                  backgroundColor: message.type === 'user' ? '#008080' : 'white',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  <div className="whitespace-pre-line text-sm">
                    {message.content}
                  </div>
                  
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left p-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded border border-teal-200 transition-colors text-sm"
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        >
                          {option}
                        </button>
                      ))}
                      {message.isWelcome && (
                        <button
                          onClick={() => handleOptionClick('Talk to Human')}
                          className="block w-full text-left p-2 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded border border-orange-200 transition-colors text-sm font-medium"
                          style={{ fontFamily: 'Manrope, sans-serif' }}
                        >
                          <Mail className="inline w-4 h-4 mr-2" />
                          Talk to Human
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showFeedback && (
              <div className="flex justify-center space-x-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Was this chat helpful?
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleFeedback(true)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-full transition-colors"
                      aria-label="Positive feedback"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-full transition-colors"
                      aria-label="Negative feedback"
                    >
                      <ThumbsDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
