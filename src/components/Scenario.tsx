import React, { useState } from 'react'
import type { ScenarioData } from '@/types'

interface ScenarioProps {
  initialData?: ScenarioData
  onSelect?: (choice: string) => void
  onSubmit?: (choice: string) => void // ✅ new optional callback
}

const Scenario: React.FC<ScenarioProps> = ({ initialData, onSelect, onSubmit }) => {
  const [data] = useState<ScenarioData | null>(initialData || null)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (choice: string) => {
    setSelectedChoice(choice)
    setSubmitted(false)
    onSelect?.(choice)
  }

  const handleSubmit = () => {
    if (selectedChoice) {
      setSubmitted(true)
      onSubmit?.(selectedChoice)
      console.log('Submitted:', selectedChoice)
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full py-10 text-gray-400">
        No scenario data provided.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center text-center w-full px-2 sm:px-4">
      {/* Scenario description */}
      <h3 className="text-base sm:text-lg font-medium text-white mb-4 leading-relaxed">
        {data.description}
      </h3>

      {/* Rectangle box */}
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 mb-4 border border-gray-700 min-h-[100px] flex items-center justify-center">
        {selectedChoice ? (
          <p className="text-white text-lg">{selectedChoice}</p>
        ) : (
          <p className="text-gray-500 text-sm italic">Select an option below...</p>
        )}
      </div>

      {/* Answer buttons */}
      <div className="flex flex-wrap justify-center gap-3 w-full mb-6">
        {data.blocks.map((block) => (
          <button
            key={block}
            onClick={() => handleSelect(block)}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all focus:outline-none focus:ring-2 ${
              selectedChoice === block
                ? 'bg-blue-600 text-white scale-[1.05]'
                : 'bg-gray-700 hover:bg-blue-600 text-white'
            }`}>
            {block}
          </button>
        ))}
      </div>

      {/* ✅ Submit button */}
      {selectedChoice && (
        <button
          onClick={handleSubmit}
          className={`inline-flex items-center justify-center
              px-6 py-3 font-medium rounded-lg
              text-center leading-none
              transition-all select-none
              ${
                submitted
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          style={{ lineHeight: 1 }}
          disabled={submitted}>
          {submitted ? 'Submitted' : 'Submit'}
        </button>
      )}
    </div>
  )
}

export default Scenario
