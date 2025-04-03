import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  return (
    <CodeMirror
      style={{ height: '500px' }}
      height="2000px"
      width="100%"
      theme="dark"
      extensions={[javascript()]}
      value={value}
      onChange={onChange}
    />
  );
};
