// src/pages/TaskRenderer.tsx
import React from "react";
import { useParams } from "react-router-dom";
import MultipleChoice from "@/components/MultipleChoice";
import DragAndDrop from "@/components/DragAndDrop";
import Scenario from "@/components/Scenario.tsx";
import { mockTasks } from "@/data/mockTasks";

const TaskRenderer: React.FC = () => {
  const { domain, taskType } = useParams<{ domain: string; taskType: string }>();
  const task = domain && taskType ? mockTasks[domain]?.[taskType] : null;

  //use effect here to fetch a question from the database.

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>No data found for {domain} - {taskType}</p>
      </div>
    );
  }

  let taskContent: React.ReactNode = null;

  switch (taskType) {
    case "multiple_choice":
      taskContent = (
        <MultipleChoice
          data={task.data}
          onSelect={(opt) => console.log("Selected:", opt)}
        />
      );
      break;

    case "drag_and_drop":
      taskContent = (
        <>
        <DragAndDrop
          items={task.items}
          containers={task.containers}
          onDrop={(container, item) =>
            console.log(`Item ${item} dropped into ${container}`)
          }
        />
        </>
      );
      break;
    case "scenario":
      taskContent = (        
        <Scenario
          initialData={task.data}
          onSelect={(choice) => console.log("Choice selected:", choice)}
        />        
      );
      break;

    default:
      return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
          <p>Unsupported task type: {taskType}</p>
        </div>
      );
  }

  return (
    <div className="p-6 bg-gray-900 text-white h-screen flex flex-col gap-6 items-center justify-center">
      {taskContent}      
    </div>
  );
};

export default TaskRenderer;
