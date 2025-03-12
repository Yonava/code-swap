import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';

const starterSnippet = `
const result = () => {
  // your solution here
}`;

export const CodeEditor = () => {
  const [code, setCode] = useState(starterSnippet);
  return (
    <CodeMirror
      style={{ height: '500px' }}
      height="600px"
      width="100%"
      theme="dark"
      extensions={[javascript()]}
      value={code}
      onChange={setCode}
    />
  );
};
