import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useMatchContext } from '@/state/match/useMatchContext';

export const CodeEditor = () => {
  const { challenge } = useMatchContext()

  return (
    <CodeMirror
      style={{ height: '500px' }}
      height="2000px"
      width="100%"
      theme="dark"
      extensions={[javascript()]}
      value={challenge?.code ?? 'no code available'}
    />
  );
};
