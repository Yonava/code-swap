import { CodeEditor } from './components/CodeEditor';
import { ProblemStatement } from './components/ProblemStatement';
import { TitledContainer } from './components/TitledContainer';

function App() {
  return (
    <>
      <div className="flex bg-gray-900 w-[100vw] h-[100vh] relative p-2 gap-2">
        {/* <div className="bg-gray-900 w-1/4 h-full rounded-md"></div> */}
        <TitledContainer title="Challenge Question">
          <div className="overflow-auto p-2 text-gray-100">
            <ProblemStatement />
          </div>
        </TitledContainer>
        <TitledContainer title="Code">
          <CodeEditor />
        </TitledContainer>
      </div>
    </>
  );
}

export default App;
