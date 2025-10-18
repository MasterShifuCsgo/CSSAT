import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MultipleChoice from '@/components/MultipleChoice'
import DragAndDrop from '@/components/DragAndDrop'
import Scenario from '@/components/Scenario.tsx'
import { api } from '@/helpers/api'

// --- Type definitions ---
type Task =
  | {
      containerType: 'multipleChoice'
      data: { title: string; options: string[] }
    }
  | {
      containerType: 'dragAndDrop'
      items: string[]
      containers: string[]
    }
  | {
      containerType: 'scenario'
      data: { description: string; blocks: string[] }
    }

// --- Map textual route names → backend numeric codes ---
const taskTypeMapping: Record<string, number> = {
  multiple_choice: 0,
  multipleChoice: 0,
  drag_and_drop: 1,
  dragAndDrop: 1,
  scenario: 2,
}

const TaskRenderer: React.FC = () => {
  const { domain, taskType } = useParams<{ domain: string; taskType: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const typeNumber = taskTypeMapping[taskType || ''] ?? 0
        console.log(`🔍 Fetching task type ${typeNumber} (${taskType})`)

        const res = await api(`/task/?knowledge_domain_id=1&taskType=${typeNumber}`)
        console.log('✅ API result:', res)

        // --- Helper to normalize arrays ---
        const normalizeList = (arr: any[]) =>
          Array.isArray(arr)
            ? arr.map((el) =>
                typeof el === 'object' && el.option ? el.option : String(el)
              )
            : []

        // --- Normalize response into frontend shape ---
        let formatted: Task | null = null

        switch (res.containerType) {
          case 'dragAndDrop':
          case 'drag_and_drop':
            formatted = {
              containerType: 'dragAndDrop',
              items: normalizeList(res.data.items),
              containers: normalizeList(res.data.containers),
            }
            break

          case 'multipleChoice':
          case 'multiple_choice':
            formatted = {
              containerType: 'multipleChoice',
              data: {
                title: res.data.title ?? 'Untitled Question',
                options: normalizeList(res.data.options),
              },
            }
            break

          case 'scenario':
            formatted = {
              containerType: 'scenario',
              data: {
                description: res.data.description ?? 'No description provided.',
                blocks: normalizeList(res.data.blocks),
              },
            }
            break

          default:
            console.warn('⚠️ Unknown containerType:', res.containerType)
            setError('Unknown task type received from server.')
            return
        }

        setTask(formatted)
      } catch (err) {
        console.error('❌ Failed to fetch task:', err)
        setError('Failed to load task from the server.')
      }
    }

    fetchTask()
  }, [domain, taskType])

  // --- Loading / Error states ---
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>{error}</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>
          Loading task for {domain} – {taskType}...
        </p>
      </div>
    )
  }

  // --- Shared styling ---
  const containerClass =
    'p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center'

  // --- Render correct component ---
  switch (task.containerType) {
    case 'multipleChoice':
      return (
        <div className={containerClass}>
          <MultipleChoice
            data={task.data}
            onSelect={(opt) => console.log('Selected:', opt)}
          />
        </div>
      )

    case 'dragAndDrop':
      return (
        <div className={containerClass}>
          <DragAndDrop
            items={task.items}
            containers={task.containers}
            onDrop={(container, item) =>
              console.log(`Item ${item} → ${container}`)
            }
          />
        </div>
      )

    case 'scenario':
      return (
        <div className={containerClass}>
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
