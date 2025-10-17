import type { MessageProps } from "@/types";
import ChatMultipleChoice from "@/components/ChatMultipleChoice";
import ChatDragAndDrop from "@/components/ChatDragAndDrop";

// --- Example dummy data for the Chat page ---
export const mockMessages: MessageProps[] = [
  {
    side: "right",
    content: "👋 Welcome to the Cyber Learning Assistant! Let's get started.",
  },  
{
  side: "right",
  content: (
    <ChatMultipleChoice
      data={{
        title:
          "Which of the following is the safest way to verify that an email claiming to be from your bank is legitimate?",
        options: [
          "Click the link in the email to log in and check.",
          "Reply to the email asking for confirmation.",
          "Call the bank using the official phone number on their website.",
          "Forward the email to your friend for advice.",
        ],
      }}
      onSelect={(opt) => console.log("User selected:", opt)}
    />
  ),
},

  {
    side: "left",
    content: "Let's do the Drag & Drop task.",
  },
  {
    side: "right",
    content: (
      <ChatDragAndDrop
        items={["Phishing", "SQL Injection", "Trojan Horse", "DDoS"]}
        containers={["Network Attacks", "Malware", "Social Engineering"]}
        onDrop={(container, item) =>
          console.log(`Item "${item}" placed into "${container}"`)
        }
      />
    ),
  },
  {
    side: "left",
    content: "Done! I dropped them in the right places.",
  },
  {
    side: "right",
    content: "Great work! You’ve completed all message types successfully 🎉",
  },
];
