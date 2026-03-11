'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWindow } from './ChatWindow';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'resize', isOpen: nextState }, '*');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatWindow onClose={toggleChat} />}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-600/30"
        aria-label="Toggle chat"
      >
        <MessageSquare size={28} />
      </motion.button>
    </>
  );
};
