// src/pages/TaskRenderer.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MultipleChoice from '@/components/MultipleChoice'
import DragAndDrop from '@/components/DragAndDrop'
import Scenario from '@/components/Scenario.tsx'
import { mockTasks } from '@/data/mockTasks'
import { api } from '@/helpers/api'

type Task =
  | {
      containerType: 'multipleChoice'
      data: {
        title: string
        options: string[]
      }
    }
  | {
      containerType: 'dragAndDrop'
      items: string[]
      containers: string[]
    }
  | {
      containerType: 'scenario'
      data: {
        description: string
        blocks: string[]
      }
    }

const TaskRenderer: React.FC = () => {
  const { domain, taskType } = useParams<{ domain: string; taskType: string }>()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const start = async () => {
      try {        
        const res: Task = await api('/task/?knowledge_domain_id=1')
        console.log('✅ API result:', res)
        setTask(res)
      } catch (err) {
        console.warn('⚠️ API failed, using mock data instead:', err)

        if (domain && taskType && mockTasks[domain]?.[taskType]) {
          const mock = mockTasks[domain][taskType]

          let formattedTask: Task
          if (taskType === 'multiple_choice') {
            formattedTask = {
              containerType: 'multipleChoice',
              data: mock.data,
            }
          } else if (taskType === 'drag_and_drop') {
            formattedTask = {
              containerType: 'dragAndDrop',
              items: mock.data.items,
              containers: mock.data.containers,
            }
          } else if (taskType === 'scenario') {
            formattedTask = {
              containerType: 'scenario',
              data: mock.data,
            }
          } else {
            throw new Error(`Unsupported mock type: ${taskType}`)
          }

          console.log('🧩 Using mock task:', formattedTask)
          setTask(formattedTask)
        } else {
          console.error('❌ No mock task found for', domain, taskType)
        }
      }
    }

    start()
  }, [domain, taskType])

  // --- UI states ---
  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>
          Loading task for {domain} - {taskType}...
        </p>
      </div>
    )
  }

  // --- Task rendering switch ---
  switch (task.containerType) {
    case 'multipleChoice':
      return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
          <MultipleChoice
            data={task.data}
            onSelect={(opt) => console.log('Selected:', opt)}
          />
        </div>
      )

    case 'dragAndDrop':
      return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
          <DragAndDrop
            items={task.items}
            containers={task.containers}
            onDrop={(container, item) =>
              console.log(`Item ${item} dropped into ${container}`)
            }
          />
        </div>
      )

    case 'scenario':
      return (
        <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
          <Scenario
            initialData={task.data}
            onSelect={(choice) => console.log('Choice selected:', choice)}
          />
        </div>
      )

    default:
      return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
          <p>Unsupported task type: {taskType}</p>
        </div>
      )
  }
}

export default TaskRenderer
