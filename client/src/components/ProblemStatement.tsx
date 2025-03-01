import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import mycssclassed from './classes';

export const ProblemStatement = () => {
  const content = `
  <header>head</header>
  <custom>fsvni</custom>
  <code>head2</code>
  `;
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={content + ' ' + mycssclassed}
      />
    </div>
  );
};
