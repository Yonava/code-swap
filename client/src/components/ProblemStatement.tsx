import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import mycssclassed from './classes';
import { Button } from './ui/Button';

export const ProblemStatement = () => {
  const content = `
  <header>head</header>
  <code>head2</code>
  `;
  return (
    <div>
      <Button>Click me</Button>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={content + ' ' + mycssclassed}
      />
    </div>
  );
};
