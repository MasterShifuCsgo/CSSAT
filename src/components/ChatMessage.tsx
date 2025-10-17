import React from "react";
import type { MessageProps } from "@/types";

const ChatMessage: React.FC<MessageProps> = ({ side = "left", content }) => {
  const isUser = side === "left";

  return (
    <div
      className={`w-full flex my-1 sm:my-1.5 md:my-2 ${
        isUser ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`px-3 py-2 rounded-2xl shadow text-sm md:text-base transition-all
          ${
            isUser
              ? "bg-gray-700 text-white rounded-bl-none"
              : "bg-blue-500 text-white rounded-br-none"
          }
          ${
            // responsive bubble width — grows with screen size
            isUser
              ? "max-w-[80%] sm:max-w-[70%] md:max-w-[60%]"
              : "max-w-[80%] sm:max-w-[70%] md:max-w-[60%]"
          }
        `}
      >
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default ChatMessage;
