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


// src/types/index.ts (or wherever your shared types live)

export interface ScenarioData {
  /** Short prompt shown above the rectangle */
  description: string;

  /** List of possible actions or answer blocks displayed below */
  blocks: string[];
}



