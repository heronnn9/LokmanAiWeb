import React from "react";

const AILoading = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm">LokmanAI düşünüyor...</span>
        </div>
      </div>
    </div>
  );
};

export default AILoading;
