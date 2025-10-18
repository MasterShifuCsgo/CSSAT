import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import networking_img from '@/assets/Networking.jpg'
import software_img from '@/assets/Software.jpg'
import cyber_security_img from '@/assets/Cyber_security.jpg'
// Assuming 'api' helper is accessible for fetching data
import { api } from '@/helpers/api' 

// --- New Type Definitions ---
type DomainPerformance = {
    domain_name: string;
    avg_correctness: number;
}

// Map domain label to an ID expected by the API
// NOTE: Adjust these IDs (1, 2, 3) to match your actual Django knowledge_domain IDs
const DOMAIN_ID_MAP: Record<string, number> = {
    'network_security': 1,
    'secure_software_development': 2,
    'cyber_hygiene': 3,
};
// ----------------------------

const Selection = () => {
    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLUListElement | null>(null)

    const card = [
        { label: 'network_security', display: 'Network security', img: networking_img, id: DOMAIN_ID_MAP['network_security'] },
        {
            label: 'secure_software_development',
            display: 'Secure software development',
            img: software_img,
            id: DOMAIN_ID_MAP['secure_software_development']
        },
        { label: 'cyber_hygiene', display: 'Cyber hygiene', img: cyber_security_img, id: DOMAIN_ID_MAP['cyber_hygiene'] },
    ]

    const taskTypes = [
        { label: 'Drag & Drop', value: 'drag_and_drop' },
        { label: 'Multiple Choice', value: 'multiple_choice' },
        { label: 'Scenario', value: 'scenario' },
    ]

    // dropdown state
    const [dropdown, setDropdown] = useState<{
        visible: boolean
        x: number
        y: number
        domain: string | null
    }>({ visible: false, x: 0, y: 0, domain: null })

    // 1️⃣ NEW STATE for domain performance
    const [performance, setPerformance] = useState<Record<string, DomainPerformance['avg_correctness']>>({});
    const [isLoading, setIsLoading] = useState(true);

    // 2️⃣ EFFECT TO FETCH DOMAIN CORRECTNESS
    useEffect(() => {
        const fetchPerformance = async () => {
            setIsLoading(true);
            const domainPromises = card.map(async (domain) => {
                if (!domain.id) return null; // Skip if ID is missing

                try {
                    // Use the 'api' helper to fetch data from the specific endpoint
                    const res: DomainPerformance = await api(`/api/domain-performance/?knowledge_domain_id=${domain.id}`);
                    return { label: domain.label, correctness: res.avg_correctness };
                } catch (err) {
                    console.error(`Failed to fetch performance for ${domain.label}:`, err);
                    return { label: domain.label, correctness: -1 }; // Use -1 to indicate an error/N/A
                }
            });

            const results = await Promise.all(domainPromises);
            
            // Map results to a single state object
            const newPerformance = results.reduce((acc, result) => {
                if (result) {
                    acc[result.label] = result.correctness;
                }
                return acc;
            }, {} as Record<string, number>);

            setPerformance(newPerformance);
            setIsLoading(false);
        };

        fetchPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // handle card click
    const handleCardClick = (e: React.MouseEvent, domain: string) => {
        e.stopPropagation()
        setDropdown({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            domain,
        })
    }

    // handle selection
    const handleTaskSelect = (taskType: string) => {
        if (!dropdown.domain) return
        setDropdown({ visible: false, x: 0, y: 0, domain: null })
        navigate(`/task/${dropdown.domain}/${taskType}`)
    }

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdown({ visible: false, x: 0, y: 0, domain: null })
            }
        }

        if (dropdown.visible) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => document.removeEventListener('click', handleClickOutside)
    }, [dropdown.visible])

    return (
        <div className="min-h-screen relative bg-black text-white">
            <div className="flex justify-center w-full py-5">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Select one of the options
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 px-4 py-5">
                {card.map(({ label, display, img }) => {
                    const correctness = performance[label];
                    const correctnessDisplay = isLoading 
                        ? 'Loading...' 
                        : correctness === -1 
                            ? 'N/A' 
                            : `${correctness.toFixed(1)}%`;

                    return (
                        <div
                            key={label}
                            onClick={(e) => handleCardClick(e, label)}
                            className="w-full lg:flex-1 relative flex flex-col justify-between items-center 
                                        text-center text-2xl font-bold rounded-lg border border-transparent 
                                        text-white hover:opacity-90 cursor-pointer select-none 
                                        min-h-[25vh] lg:min-h-[70vh] overflow-hidden p-6" // Added p-6 for padding
                            style={{
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Top area for the title/display */}
                            <span className="relative z-10 bg-black/70 px-4 py-2 rounded max-w-[70%] mt-auto">
                                {display}
                            </span>
                            
                            {/* 3️⃣ BOTTOM AREA for correctness */}
                            <div className="relative z-10 bg-indigo-700/80 w-full p-2 mt-2 rounded-lg text-lg font-semibold flex flex-col items-center">
                                <span className="text-sm font-light">Your Average Correctness:</span>
                                <span>
                                    {correctnessDisplay}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* dropdown (Unchanged) */}
            {dropdown.visible && (
                <ul
                    ref={dropdownRef}
                    className="fixed bg-gray-900 border border-gray-700 rounded shadow-lg text-white text-sm"
                    style={{
                        top: dropdown.y,
                        left: dropdown.x,
                        transform: 'translate(5px, 5px)',
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()}>
                    {taskTypes.map((t) => (
                        <li
                            key={t.value}
                            onClick={() => handleTaskSelect(t.value)}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer whitespace-nowrap">
                            {t.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Selection