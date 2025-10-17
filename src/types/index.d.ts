export interface MessageProps {
  side?: "left" | "right";
  content: string | JSX.Element;
}

export interface MultipleChoiceProps {
  data: {
    title: string;
    options: string[];
  };
  onSelect?: (option: string) => void;
}

export interface DragAndDropProps {
  items: string[];
  containers: string[];
  onDrop?: (container: string, item: string) => void;
}

export interface ChatMessage {
  side: "left" | "right";
  content: string | JSX.Element;
}

