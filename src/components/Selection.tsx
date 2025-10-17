// src/components/Scenario.tsx
import React, { useState } from 'react'
import type { ScenarioData } from '@/types'

interface ScenarioProps {  
  initialData: ScenarioData
}

const Scenario: React.FC<ScenarioProps> = ({ initialData }) => {
  const [currentScenario] = useState<ScenarioData>(initialData)

  async function fetchScenario(
    currentScenario: ScenarioData,
    selectedBlock: string,
  ): Promise<ScenarioData> {    
    // Example structure only — do not uncomment until backend exists.
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/scenario/next`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: currentScenario,
        choice: selectedBlock,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch next scenario')
    }

    const data: ScenarioData = await response.json()
    return data

    // Temporary placeholder
    console.log('fetchScenario called with:', currentScenario, selectedBlock)
    throw new Error('fetchScenario: baseAPI not yet defined')
  }

  const handleSelect = (choice: string) => {
    console.log('Selected block:', choice)
    console.log('Current scenario:', currentScenario)
  }

  return (
    <div className="flex flex-col items-center text-center w-full px-2 sm:px-4">
      {/* Description (text above the rectangle) */}
      <h3 className="text-base sm:text-lg font-medium text-white mb-4 leading-relaxed max-w-2xl">
        {currentScenario.description}
      </h3>

      {/* Rectangle container */}
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 mb-4 border border-gray-700">
        <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
          {/* Placeholder for future dynamic content */}
        </p>
      </div>

      {/* Blocks (answer buttons) */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {currentScenario.blocks.map((block) => (
          <button
            key={block}
            onClick={() => handleSelect(block)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 hover:bg-blue-600 active:bg-blue-700 
                       text-white rounded-lg transition-all text-sm sm:text-base font-medium 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-[1.03]">
            {block}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Scenario
