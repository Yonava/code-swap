import { CodeEditor } from './components/CodeEditor';
import { ProblemStatement } from './components/ProblemStatement';
import { TitledContainer } from './components/TitledContainer';

function App() {
  return (
    <>
      <div className="flex bg-gray-900 w-[100vw] h-[100vh] relative p-2 gap-2">
        <TitledContainer
          title="Challenge Question"
          width="25%"
        >
          <div className="overflow-auto p-2 text-gray-100">
            <ProblemStatement />
            <span className="text-4xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit hic
              eum neque ea, nulla vel, incidunt repellat, doloribus eveniet ab
              laudantium dicta iure consequuntur id error aperiam harum? Natus
              qui molestiae magni quod cumque mollitia enim dolores odio, quo
              recusandae est quasi sint atque doloremque autem quibusdam.
              Accusamus natus laborum recusandae est, totam, repellendus minus
              velit optio officiis aliquam laudantium impedit, commodi sunt!
              Rem, temporibus eius delectus nam deserunt aut nemo ex cupiditate
              voluptate dignissimos consequuntur, itaque dolorem! Ab iusto harum
              nisi beatae ipsam iste id fuga quia asperiores? Odit perferendis
              eveniet nulla amet corrupti quas aliquam in tenetur nobis!
            </span>
          </div>
        </TitledContainer>
        <TitledContainer
          title="Code"
          width="75%"
        >
          <CodeEditor />
        </TitledContainer>
      </div>
    </>
  );
}

export default App;
