import { useMemo, useState } from 'react';
import { Button } from './ui/Button';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  const btns = useMemo(() => ({
    0: 'bt1',
    1: 'bt2',
    2: 'bt3'
  }), [])

  const btnsArr = useMemo(() => {
    return Object.entries(btns).map(([key, val]) => Number(key))
  }, [btns])

  return (
    <div className="w-full h-full bg-gray-400 text-black p-3">
      <div className="flex gap-2 mb-4">
        {btnsArr.map((i) => (
          <Button
            className={`p-2 ${activeTab === (i+1) ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
            onClick={() => setActiveTab(i + 1)}
          >
            Case {i+1}
          </Button>
        ))}
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
