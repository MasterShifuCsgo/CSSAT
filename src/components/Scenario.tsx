import React, { useState } from 'react'
// Assuming ScenarioData is imported and updated in '@/types'
interface ScenarioBlock {
    id: number;
    option: string;
    correctness: number;
    task: number;
}
interface ScenarioData {
    description: string;
    blocks: ScenarioBlock[];
}

interface ScenarioProps {
    initialData?: ScenarioData
    // onSelect/onSubmit should now receive the selected Block ID, not the string label
    onSelect?: (choiceId: number) => void
    // This is the handler that TaskRenderer uses to trigger the API call
    onSubmit?: (choiceId: number) => void 
}

const Scenario: React.FC<ScenarioProps> = ({ initialData, onSelect, onSubmit }) => {
    const [data] = useState<ScenarioData | null>(initialData || null)
    // Track the selected choice by its ID, not its string value
    const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState(false)

    // Helper to get the selected block object
    const selectedBlock = data?.blocks.find(b => b.id === selectedChoiceId);


    // Takes the ID of the block
    const handleSelect = (blockId: number) => {
        setSelectedChoiceId(blockId)
        setSubmitted(false)
        onSelect?.(blockId)
    }

    const handleSubmit = () => {
        if (selectedChoiceId) {
            setSubmitted(true)
            // Submit the selected ID, which the parent will use as the "answer" field
            onSubmit?.(selectedChoiceId) 
            console.log('Submitted ID:', selectedChoiceId)
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

            {/* Rectangle box - Displays the selected option's text */}
            <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 mb-4 border border-gray-700 min-h-[100px] flex items-center justify-center">
                {selectedBlock ? (
                    // Display the 'option' property
                    <p className="text-white text-lg">{selectedBlock.option}</p>
                ) : (
                    <p className="text-gray-500 text-sm italic">Select an option below...</p>
                )}
            </div>

            {/* Answer buttons */}
            <div className="flex flex-wrap justify-center gap-3 w-full mb-6">
                {/* Iterate over blocks and use block.id as key and block.option as display text */}
                {data.blocks.map((block) => (
                    <button
                        // Use a unique numerical ID as the key
                        key={block.id} 
                        // Pass the ID to the handler
                        onClick={() => handleSelect(block.id)} 
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all focus:outline-none focus:ring-2 ${
                            // Check against selectedChoiceId
                            selectedChoiceId === block.id
                                ? 'bg-blue-600 text-white scale-[1.05]'
                                : 'bg-gray-700 hover:bg-blue-600 text-white'
                        }`}>
                        {/* Display the 'option' property */}
                        {block.option} 
                    </button>
                ))}
            </div>

            {/* Submit button */}
            {selectedChoiceId && (
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
