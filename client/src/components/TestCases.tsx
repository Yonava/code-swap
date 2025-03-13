import { useState } from 'react';
import { Button } from './ui/Button';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="w-full h-full bg-gray-400 text-black p-3">
      <div className="flex gap-2 mb-4">
        <Button
          className={`p-2 ${activeTab === 1 ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
          onClick={() => setActiveTab(1)}
        >
          Case 1
        </Button>
        <Button
          className={`p-2 ${activeTab === 2 ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
          onClick={() => setActiveTab(2)}
        >
          Case 2
        </Button>
        <Button
          className={`p-2 ${activeTab === 3 ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
          onClick={() => setActiveTab(3)}
        >
          Case 3
        </Button>
      </div>
      {activeTab === 1 && (
        <div>
          <p className="font-bold">Expected:</p>
          <input
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            defaultValue="[3,3]"
          />
          <p className="font-bold">Output:</p>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="6"
          />
        </div>
      )}
      {activeTab === 2 && (
        <div>
          <p className="font-bold">Expected:</p>
          <input
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            defaultValue="[1,2,3]"
          />
          <p className="font-bold">Output:</p>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="5"
          />
        </div>
      )}
      {activeTab === 3 && (
        <div>
          <p className="font-bold">Expected:</p>
          <input
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            defaultValue="[2,4,6]"
          />
          <p className="font-bold">Output:</p>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="10"
          />
        </div>
      )}
    </div>
  );
};
