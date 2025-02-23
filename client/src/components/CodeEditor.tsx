import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';

export const CodeEditor = () => {
  const [code, setCode] = useState('omg');
  return (
    <CodeMirror
      height="100%"
      width="100%"
      theme="dark"
      extensions={[javascript()]}
      value={code}
      onChange={setCode}
    />
  );
};
