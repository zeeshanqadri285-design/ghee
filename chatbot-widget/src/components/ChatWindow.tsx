'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, MessageSquare } from 'lucide-react';
import { MessageBubble, Message } from './MessageBubble';

export const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! Welcome to our dairy store. I can help you order our pure Cow Desi Ghee or Fresh Butter. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech Recognition hook setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const defaultSpeechR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (defaultSpeechR) {
      const recognition = new defaultSpeechR();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInput(transcript);
        
        if (event.results[0].isFinal) {
          // Optional: automatically send when stopped
          // handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const synthesizeSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;
    
    // Stop listening if sending
    if (isListening) {
      recognitionRef.current?.stop();
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create history array in the format expected by our API route
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend.trim(),
          history 
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      };

      setMessages((prev) => [...prev, responseMessage]);
      if (!data.response.startsWith('ORDER_COMPLETE:')) {
        synthesizeSpeech(data.response);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting right now. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-20 right-4 sm:right-6 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Dairy Store Assistant</h3>
            <p className="text-xs text-green-100">Online & ready to help</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-green-700 p-1.5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 border border-gray-100">
              <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
              <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-full transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-green-600 hover:bg-white'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-gray-800"
          />
          
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-green-600 text-white p-2.5 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
