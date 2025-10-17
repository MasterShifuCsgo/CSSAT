import type { MultipleChoiceProps } from "@/types";
import React from "react";

const ChatMultipleChoice: React.FC<MultipleChoiceProps> = ({ data, onSelect }) => {
  return (
    <div className="flex flex-col items-center text-center w-full px-2 sm:px-4">
      {/* Question / prompt */}
      <h3 className="text-base sm:text-lg font-medium text-white mb-4 leading-relaxed">
        {data.title}
      </h3>

      {/* Answer choices */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {data.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect?.(opt)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-blue-600 active:bg-blue-700 
                       text-white rounded-lg transition-colors text-sm sm:text-base font-medium 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatMultipleChoice;
