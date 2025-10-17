import React, { useEffect, useState } from "react";
import type { ScenarioData } from "@/types";

interface ScenarioProps {
  /** Optional: initial scenario ID or data */
  initialData?: ScenarioData;
  /** Fetch function to load new scenario steps */
  fetchScenario?: (id?: string) => Promise<ScenarioData>;
  /** Optional callback when user selects an answer */
  onSelect?: (choice: string, nextId?: string) => void;
}

const Scenario: React.FC<ScenarioProps> = ({ initialData, onSelect }) => {
  const [data, setData] = useState<ScenarioData | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  async function fetchScenario(){
    //fetch the scenario details here.
  }

  // Load scenario data if not given or when it evolves
  useEffect(() => {
    if (!data && fetchScenario) {
      setLoading(true);
      fetchScenario().then((d) => {
        setData(d);
        setLoading(false);
      });
    }
  }, [data, fetchScenario]);

  const handleSelect = async (choice: string) => {
    // optional next-step logic
    const nextId = data?.next?.[choice];
    onSelect?.(choice, nextId);

    if (fetchScenario && nextId) {
      setLoading(true);
      const next = await fetchScenario(nextId);
      setData(next);
      setLoading(false);
    }
  };

  if (loading || !data)
    return (
      <div className="flex items-center justify-center w-full py-10 text-gray-400">
        Loading scenario...
      </div>
    );

  return (
    <div className="flex flex-col items-center text-center w-full px-2 sm:px-4">
      {/* Scenario prompt / question */}
      <h3 className="text-base sm:text-lg font-medium text-white mb-4 leading-relaxed">
        {data.prompt}
      </h3>

      {/* Scenario container (the "rectangle") */}
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-6 mb-4 border border-gray-700">
        <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
          {data.description}
        </p>
      </div>

      {/* Answer choices */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {data.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleSelect(choice)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 hover:bg-blue-600 active:bg-blue-700 
                       text-white rounded-lg transition-all text-sm sm:text-base font-medium 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-[1.03]"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Scenario;
