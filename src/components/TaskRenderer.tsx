import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MultipleChoice from '@/components/MultipleChoice'
import DragAndDrop from '@/components/DragAndDrop'
import Scenario from '@/components/Scenario.tsx'
import { api } from '@/helpers/api'
import { mockTasks } from '@/data/mockTasks' 

// 🚨 TEMPORARY MOCK FLAG: Set to true to use mock data
const MOCK_MODE = false 

// --- Submission Type Definitions ---
type SubmissionResult = {
    task_successful: boolean;
    response_time: number;
    avg_correctness: number;
} | null;

// --- API Option Types (Shared by MultipleChoice, DragAndDrop, Scenario) ---
type OptionBase = {
    id: number
    option: string // The text/label shown to the user
    task: number
}

// --- Component Type Definitions ---
// These define the internal structure derived from the API
type MultipleChoiceOption = OptionBase & {
    correctness: number 
}

type DragAndDropField = {
    id: number
    label: string // Mapped from API's "containers" option
}

type DragAndDropItem = {
    id: number
    label: string // Mapped from API's "items" option
}

type ScenarioBlock = OptionBase & {
    correctness: number
}

type Task =
    | {
        id: number
        containerType: 'multipleChoice'
        data: {
            title: string
            options: MultipleChoiceOption[] // Structured object array
        }
    }
    | {
        id: number
        containerType: 'dragAndDrop'
        data: {
            fields: DragAndDropField[]
            dropOptions: DragAndDropItem[]
        }
    }
    | {
        id: number
        containerType: 'scenario'
        data: {
            description: string
            blocks: ScenarioBlock[] // Structured object array
        }
    }

// ----------------------------------------------------
// 💡 CONSTANTS AND HELPERS (Moved to top-level scope)
// ----------------------------------------------------

const taskTypeMapping: Record<string, number> = {
    multiple_choice: 0,
    multipleChoice: 0,
    drag_and_drop: 1,
    dragAndDrop: 1,
    scenario: 2,
}

const CONTAINER_CLASS = 'p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center'
const ERROR_LOADING_CLASS = 'flex items-center justify-center h-screen text-white bg-black'

/**
 * 🛠️ Formats the raw API response data into the strict Task type structure.
 */
const formatTaskData = (res: any): Task | null => {
    switch (res.containerType) {
        case 'dragAndDrop':
        case 'drag_and_drop':
            return {
                id: res.id,
                containerType: 'dragAndDrop',
                data: {
                    fields: Array.isArray(res.data.containers)
                        ? res.data.containers.map((c: any) => ({ id: c.id, label: c.option ?? String(c) }))
                        : [],
                    dropOptions: Array.isArray(res.data.items)
                        ? res.data.items.map((i: any) => ({ id: i.id, label: i.option ?? String(i) }))
                        : [],
                },
            }

        case 'multipleChoice':
        case 'multiple_choice':
            return {
                id: res.id,
                containerType: 'multipleChoice',
                data: {
                    title: res.data.title ?? 'Untitled Question',
                    options: Array.isArray(res.data.options)
                        ? res.data.options.map((o: any) => ({ id: o.id, option: o.option, correctness: o.correctness, task: o.task }))
                        : [],
                },
            }

        case 'scenario':
            return {
                id: res.id,
                containerType: 'scenario',
                data: {
                    description: res.data.description ?? 'No description provided.',
                    blocks: Array.isArray(res.data.blocks)
                        ? res.data.blocks.map((b: any) => ({ id: b.id, option: b.option, correctness: b.correctness, task: b.task }))
                        : [],
                },
            }

        default:
            console.warn('⚠️ Unknown containerType:', res.containerType)
            return null
    }
}

/**
 * 🎭 Mocks the API call using local mock data.
 */
const mockFetchTask = (domain: string, taskType: string): Promise<any> => {
    const taskKey = taskType.includes('_') ? taskType : taskType.replace(/([A-Z])/g, '_$1').toLowerCase();
    const taskData = (mockTasks as any)?.[domain]?.[taskKey]; 

    if (!taskData) {
        return Promise.reject(new Error(`Mock data not found for ${domain}/${taskKey}`));
    }

    let idCounter = 1;
    const taskId = 100;

    const getOptionArray = (options: string[], includeCorrectness: boolean = false) => {
        return options.map((option) => ({
            id: idCounter++,
            option: option,
            task: taskId,
            ...(includeCorrectness && { correctness: Math.floor(Math.random() * 100) + 1 }),
        }));
    };

    let response: any;
    let containerType: string;

    if (taskKey.includes('multiple_choice')) {
        containerType = 'multipleChoice';
        response = {
            id: taskId,
            containerType: containerType,
            data: {
                title: taskData.data.title,
                options: getOptionArray(taskData.data.options, true),
            },
        };
    } else if (taskKey.includes('drag_and_drop')) {
        containerType = 'dragAndDrop';
        response = {
            id: taskId,
            containerType: containerType,
            data: {
                description: taskData.data.description || "Mock Drag and Drop Task",
                items: getOptionArray(taskData.data.items),
                containers: getOptionArray(taskData.data.containers),
            },
        };
    } else if (taskKey.includes('scenario')) {
        containerType = 'scenario';
        response = {
            id: taskId,
            containerType: containerType,
            data: {
                description: taskData.data.description,
                blocks: getOptionArray(taskData.data.blocks, true),
            },
        };
    } else {
        return Promise.reject(new Error(`Unknown mock task type: ${taskKey}`));
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(response), 500);
    });
};

// --- Feedback Component ---
const SubmissionFeedback: React.FC<{ result: SubmissionResult; onNext: () => void }> = ({ result, onNext }) => {
    if (!result) return null;

    const { task_successful, response_time, avg_correctness } = result;

    return (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center p-8 z-10">
            <div className="bg-white text-gray-900 p-10 rounded-xl shadow-2xl max-w-lg w-full text-center">
                <h2 className="text-3xl font-bold mb-4">
                    {task_successful ? '✅ Submission Successful!' : '⚠️ Submission Received'}
                </h2>
                
                <div className="text-left space-y-2 text-lg">
                    <p><strong>Correctness:</strong> <span className="font-mono text-green-600">{avg_correctness.toFixed(1)}%</span></p>
                    <p><strong>Response Time:</strong> <span className="font-mono">{response_time.toFixed(2)} seconds</span></p>
                </div>

                <button 
                    onClick={onNext}
                    className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                >
                    Continue to Next Task
                </button>
            </div>
        </div>
    );
};

// --- useTaskLoader Hook ---
const useTaskLoader = (domain: string, taskType: string) => {
    const [task, setTask] = useState<Task | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [dragStartTime, setDragStartTime] = useState<number | null>(null)
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult>(null);

    const loadNewTask = () => {
        setSubmissionResult(null);
        // In a real app, this should trigger a change in route/params to load a new task
        // For now, we rely on the component being remounted or params changing externally.
        // If we want to reload the same task, we'd need a dedicated trigger in the dependency array.
    };

    useEffect(() => {
        const fetchTask = async () => {
            setTask(null) 
            setError(null) 
            setDragStartTime(null)
            setSubmissionResult(null);

            try {
                const typeNumber = taskTypeMapping[taskType || ''] ?? 0
                console.log(`🔍 Fetching task type ${typeNumber} (${taskType}) for domain ${domain}`)

                let res: any;

                if (MOCK_MODE) {
                    const mockTaskType = taskType.replace(/([A-Z])/g, '_$1').toLowerCase();
                    res = await mockFetchTask(domain, mockTaskType);
                    console.log('✅ Mock result:', res)
                } else {
                    res = await api(
                        `/task/?knowledge_domain_id=1&task_type=${typeNumber}`
                    )
                    console.log('✅ API result:', res)
                }

                const formattedTask = formatTaskData(res)

                if (!formattedTask) {
                    setError('Unknown task type received from server.')
                    return
                }

                setTask(formattedTask)
                if (formattedTask.containerType === 'dragAndDrop') {
                    setDragStartTime(Date.now())
                }
            } catch (err) {
                console.error('❌ Failed to fetch task:', err)
                setError('Failed to load task from the server.')
            }
        }

        fetchTask()
    }, [domain, taskType])

    return { task, error, dragStartTime, submissionResult, setSubmissionResult, loadNewTask, setError }
}


// --- Submission Functions ---
const MOCK_API_RESPONSE: SubmissionResult = {
    task_successful: true,
    response_time: 5.0,
    avg_correctness: 100.0,
};

const submitMultipleChoice = async (
    task: Task & { containerType: 'multipleChoice' }, 
    selectedOptionLabel: string, // 💡 FIX 3: Component passes the string label, not the object
    setSubmissionResult: (result: SubmissionResult) => void,
    setError: (error: string | null) => void
) => {
    // 💡 Must find the ID of the selected option using the label
    const selectedOption = task.data.options.find(opt => opt.option === selectedOptionLabel);

    if (!selectedOption) {
        console.error('Submission error: Could not find option ID for label:', selectedOptionLabel);
        setError('Submission failed: Invalid option.');
        return;
    }

    const payload = {
        task: task.id,
        answers: task.data.options.map((opt) => ({
            answer_id: opt.id,
            selected: opt.id === selectedOption.id,
        })),
    }

    if (MOCK_MODE) {
        console.log('✅ MOCK: Multiple-choice submission payload:', payload);
        setSubmissionResult(MOCK_API_RESPONSE);
        return;
    }

    try {
        const res: SubmissionResult = await api('/api/submit-task/', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
        setSubmissionResult(res);
    } catch (err) {
        console.error('❌ Submission failed:', err)
        setError('Multiple-choice submission failed.') 
    }
}


const submitDragAndDrop = async (
    task: Task & { containerType: 'dragAndDrop' }, 
    pairs: { fieldId: number; dropOptionId: number }[],
    dragStartTime: number | null,
    setSubmissionResult: (result: SubmissionResult) => void,
    setError: (error: string | null) => void
) => {
    const responseTime = dragStartTime
        ? (Date.now() - dragStartTime) / 1000 
        : null

    const payload = {
        task: task.id,
        answers: pairs.map((p) => ({
            field: p.fieldId,
            drop_option: p.dropOptionId,
        })),
        response_time: responseTime,
    }

    if (MOCK_MODE) {
        console.log('✅ MOCK: Drag-and-drop submission payload:', payload);
        setSubmissionResult(MOCK_API_RESPONSE);
        return;
    }

    try {
        const res: SubmissionResult = await api('/api/submit-task/', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
        setSubmissionResult(res);
    } catch (err) {
        console.error('❌ Drag-and-drop submission failed:', err)
        setError('Drag-and-drop submission failed.')
    }
}

const submitScenario = async (
    task: Task & { containerType: 'scenario' },
    selectedOptionLabel: string, // 💡 FIX 3: Component passes the string label
    setSubmissionResult: (result: SubmissionResult) => void,
    setError: (error: string | null) => void
) => {
    // 💡 Must find the ID of the selected option using the label
    const selectedBlock = task.data.blocks.find(block => block.option === selectedOptionLabel);

    if (!selectedBlock) {
        console.error('Submission error: Could not find block ID for label:', selectedOptionLabel);
        setError('Submission failed: Invalid scenario block.');
        return;
    }

    const payload = {
        task: task.id,
        answer: selectedBlock.id, // Use the found ID
    }

    if (MOCK_MODE) {
        console.log('✅ MOCK: Scenario submission payload:', payload);
        setSubmissionResult(MOCK_API_RESPONSE);
        return;
    }

    try {
        const res: SubmissionResult = await api('/api/submit-task/', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
        setSubmissionResult(res);
    } catch (err) {
        console.error('❌ Scenario submission failed:', err)
        setError('Scenario submission failed.')
    }
}


// --- renderTaskComponent (Fixed type compatibility) ---
const renderTaskComponent = (
    task: Task, 
    dragStartTime: number | null, 
    setSubmissionResult: (result: SubmissionResult) => void, 
    setError: (error: string | null) => void 
) => {
    switch (task.containerType) {
        // 🟦 MULTIPLE CHOICE
        case 'multipleChoice':
            // 💡 FIX: Map the structured options (objects) to simple strings for the component
            const mcOptions = task.data.options.map(o => o.option);
            
            return (
                <MultipleChoice
                    data={{
                        title: task.data.title,
                        options: mcOptions // Pass simple string array
                    }}
                    // 💡 FIX: onSelect receives the string label, which is passed to submitMC
                    onSelect={async (selectedOptionLabel) => {
                        await submitMultipleChoice(task, selectedOptionLabel, setSubmissionResult, setError)
                    }}
                />
            )

        // 📦 DRAG AND DROP
        case 'dragAndDrop': { 
            const containerLabels = task.data.fields.map(f => f.label);
            const itemLabels = task.data.dropOptions.map(o => o.label);

            return (
                <DragAndDrop
                    containers={containerLabels}
                    items={itemLabels}
                    
                    onSubmit={async (assignments: Record<string, string[]>) => {
                        const pairs: { fieldId: number; dropOptionId: number }[] = [];

                        Object.entries(assignments).forEach(([containerLabel, itemLabels]) => {
                            const field = task.data.fields.find(f => f.label === containerLabel);
                            
                            if (!field) { 
                                console.warn(`Could not find ID for container: ${containerLabel}`); 
                                return; 
                            }
                            
                            itemLabels.forEach(itemLabel => {
                                const dropOption = task.data.dropOptions.find(o => o.label === itemLabel);
                                
                                if (dropOption) {
                                    pairs.push({ fieldId: field.id, dropOptionId: dropOption.id });
                                } else {
                                    console.warn(`Could not find ID for drop item: ${itemLabel}`);
                                }
                            });
                        });

                        await submitDragAndDrop(task, pairs, dragStartTime, setSubmissionResult, setError)
                    }}
                />
            )
        }

        // 📄 SCENARIO
        case 'scenario':
            // 💡 FIX: Map the structured blocks (objects) to simple strings for the component
            const scenarioBlocks = task.data.blocks.map(b => b.option);

            return (
                <Scenario
                    initialData={{
                        description: task.data.description,
                        blocks: scenarioBlocks // Pass simple string array
                    }}
                    // 💡 FIX: onSelect receives the string label, which is passed to submitScenario
                    onSelect={async (selectedBlockLabel: string) => {
                        await submitScenario(task, selectedBlockLabel, setSubmissionResult, setError)
                    }}
                />
            )

        default:
            return (
                <div className={ERROR_LOADING_CLASS}>
                    <p>Unsupported task type: {task.containerType}</p>
                </div>
            )
    }
}


const TaskRenderer: React.FC = () => {
    const { domain, taskType } = useParams<{ domain: string; taskType: string }>()
    const { 
        task, 
        error, 
        dragStartTime, 
        submissionResult, 
        setSubmissionResult, 
        loadNewTask,
        setError
    } = useTaskLoader(domain || '', taskType || '')

    // --- Loading / Error states ---
    if (error) {
        return (
            <div className={ERROR_LOADING_CLASS}>
                <p>🚨 Error: {error}</p>
            </div>
        )
    }

    if (!task) {
        return (
            <div className={ERROR_LOADING_CLASS}>
                <p>
                    ⏳ Loading task for **{domain}** – **{taskType}**...
                </p>
            </div>
        )
    }

    // --- Render correct component ---
    return (
        <div className={CONTAINER_CLASS}>
            {renderTaskComponent(task, dragStartTime, setSubmissionResult, setError)}
            
            {/* Render the feedback overlay if submissionResult is present */}
            {submissionResult && (
                <SubmissionFeedback 
                    result={submissionResult} 
                    onNext={loadNewTask} 
                />
            )}
        </div>
    )
}

export default TaskRenderer