import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';

export const CodeEditor = () => {
  const [code, setCode] = useState('omg');
  return (
    <div style={{ height: '500px', width: '700px', background: 'green' }}>
      <CodeMirror
        height="50vh"
        width="50%"
        theme="dark"
        extensions={[javascript()]}
        value={code}
        onChange={setCode}
      />
      <ul>
        {code.split('\n').map((n, i) => (
          <li>
            {i + 1} - {n}
          </li>
        ))}
      </ul>
    </div>
  );
};
