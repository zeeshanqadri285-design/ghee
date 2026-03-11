import React from 'react';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  // Handle Special Order Complete Message
  if (isAssistant && message.content.startsWith('ORDER_COMPLETE:')) {
    const parts = message.content.replace('ORDER_COMPLETE:', '').split('|').map(p => p.trim());
    if (parts.length >= 5) {
      const [product, quantity, name, city, phone] = parts;
      
      const whatsappText = encodeURIComponent(`Hi, I would like to place an order from your website.\n\n*Product*: ${product}\n*Quantity*: ${quantity}\n*Name*: ${name}\n*City*: ${city}\n*Phone*: ${phone}`);
      const whatsappUrl = `https://wa.me/923161678092?text=${whatsappText}`;

      return (
        <div className="flex w-full mb-4 justify-start">
          <div className="max-w-[85%] rounded-2xl px-4 py-4 text-sm shadow-md bg-white text-gray-800 rounded-bl-none border border-green-200">
            <h4 className="font-bold text-green-700 text-base mb-2">🎉 Order Summary</h4>
            <div className="space-y-1 mb-4">
              <p><strong>Item:</strong> {product} ({quantity})</p>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>City:</strong> {city}</p>
              <p><strong>Phone:</strong> {phone}</p>
            </div>
            <p className="text-gray-600 italic mb-3">Please click the button below to confirm your order via WhatsApp.</p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#25D366] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1ebd59] transition-colors"
            >
              Send exactly to WhatsApp
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className={`flex w-full mb-4 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isAssistant
            ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            : 'bg-green-600 text-white rounded-br-none'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};
