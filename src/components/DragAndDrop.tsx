// src/components/DragAndDrop.tsx
import React, { useState } from "react";
// Assuming DragAndDropProps now includes onSubmit: (assignments: Record<string, string[]>) => void
import type { DragAndDropProps } from "@/types";

const DragAndDrop: React.FC<DragAndDropProps> = ({
  items,
  containers,
  onDrop,
  onSubmit,
}) => {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [availableItems, setAvailableItems] = useState<string[]>([...items]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // --- Drop logic ---
  const handleDrop = (container: string, item: string) => {
    // Current logic: allows one item to be dropped into one container, 
    // and multiple items can go into the same container.
    if (assignments[container]?.includes(item)) return;

    setAssignments((prev) => ({
      ...prev,
      [container]: [...(prev[container] || []), item],
    }));

    setAvailableItems((prev) => prev.filter((i) => i !== item));
    onDrop?.(container, item);
  };

  const handleRemove = (container: string, item: string) => {
    setAssignments((prev) => ({
      ...prev,
      [container]: (prev[container] || []).filter((i) => i !== item),
    }));
    setAvailableItems((prev) => [...prev, item]);
  };

  // --- Drag (desktop) ---
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData("item", item);
    setActiveItem(item);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDropHandler = (e: React.DragEvent<HTMLDivElement>, container: string) => {
    const item = e.dataTransfer.getData("item");
    if (item) handleDrop(container, item);
    setActiveItem(null);
  };

  // --- Touch (mobile) ---
  const onTouchStart = (item: string) => setActiveItem(item);
  const onTouchEnd = (container: string | null) => {
    if (container && activeItem) handleDrop(container, activeItem);
    setActiveItem(null);
  };

  // 👈🏼 ADDED: Submission handler
  const handleSubmit = () => {
    // Only submit if all available items are placed (optional check)
    if (availableItems.length === 0) {
      onSubmit?.(assignments);
    } else {
      // You can replace this alert with a more user-friendly UI feedback
      alert(`Please place all ${availableItems.length} remaining items.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-white select-none p-4">
      {/* --- Items section --- */}
      <div className="flex flex-col gap-2 w-full">
        <h4 className="font-semibold mb-2 text-white">Items</h4>
        {availableItems.length === 0 ? (
          <p className="text-gray-400 text-sm italic">All items placed</p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {availableItems.map((item) => (
              <div
                key={item}
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                onTouchStart={() => onTouchStart(item)}
                className={`p-2 bg-gray-700 rounded text-center cursor-move hover:bg-gray-600 transition-colors min-w-[120px] ${
                  activeItem === item ? "opacity-50" : ""
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Containers grid --- */}
      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-2 
          lg:grid-cols-3
          gap-4
          w-full
          justify-items-center
        "
      >
        {containers.map((container) => (
          <div
            key={container}
            onDragOver={onDragOver}
            onDrop={(e) => onDropHandler(e, container)}
            onTouchEnd={() => onTouchEnd(container)}
            className={`w-full sm:w-[90%] lg:w-[80%] min-h-28 border-2 border-dashed rounded p-3 text-center transition-all bg-gray-800 ${
              activeItem ? "border-blue-500" : "border-gray-500"
            }`}
          >
            <p className="font-medium text-blue-300 mb-2">{container}</p>
            <ul className="text-sm space-y-1">
              {(assignments[container] || []).map((i) => (
                <li
                  key={i}
                  className="bg-blue-600 text-white rounded px-2 py-1 flex justify-between items-center"
                >
                  {i}
                  <button
                    onClick={() => handleRemove(container, i)}
                    className="ml-2 text-xs bg-red-600 hover:bg-red-700 px-1 rounded"
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* 👈🏼 ADDED: Submission Button */}
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={availableItems.length > 0} // Optional: Disable until all items are placed
          className={`px-8 py-3 rounded text-lg font-bold transition-colors ${
            availableItems.length === 0
              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
        >
          Submit Assignment
        </button>
      </div>
    </div>
  );
};

export default DragAndDrop;