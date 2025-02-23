import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export const CodeEditor = () => {
  return (
    <div style={{ height: '500px', width: '700px', background: 'green' }}>
      <CodeMirror
        height="50vh"
        width="50%"
        theme="dark"
        extensions={[javascript()]}
      />
    </div>
  );
};
