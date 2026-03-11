import React from 'react';
import { ChatWidget } from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Premium Dairy Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the rich taste of our 100% pure Cow Desi Ghee and farm-fresh Butter. 
            Delivered straight to your home.
          </p>
        </header>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="h-48 bg-yellow-50 rounded-xl mb-6 flex items-center justify-center border border-yellow-100">
              <span className="text-4xl">🧈</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cow Desi Ghee</h2>
            <p className="text-gray-600 mb-4">100% pure, natural, and aromatic desi ghee made from fresh cow milk.</p>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xl font-bold text-green-700">2500 PKR <span className="text-sm font-normal text-gray-500">/ kg</span></span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-50 rounded-xl mb-6 flex items-center justify-center border border-gray-100">
              <span className="text-4xl">🥛</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Fresh Butter</h2>
            <p className="text-gray-600 mb-4">Creamy, rich, and delicious butter made from the freshest milk.</p>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xl font-bold text-green-700">2200 PKR <span className="text-sm font-normal text-gray-500">/ kg</span></span>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Need help ordering?</h3>
          <p className="text-green-700">
            Click the chat icon in the bottom right corner to talk to our AI Sales Assistant. 
            You can use text or voice to place your order!
          </p>
        </div>
      </div>

      {/* Embedded Chatbot Widget */}
      <ChatWidget />
    </main>
  );
}
