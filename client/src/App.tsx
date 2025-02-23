import { CodeEditor } from './components/CodeEditor';
import { ProblemStatement } from './components/ProblemStatement';
import { Button } from './components/ui/button';

function App() {
  return (
    <>
      <div className="flex">
        {/* <ProblemStatement /> */}
        <CodeEditor />
        <Button>hi</Button>
      </div>
    </>
  );
}

export default App;
