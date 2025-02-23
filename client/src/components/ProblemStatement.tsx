import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const ProblemStatement = () => {
  const classes = '<style> .test { color: red } </style>';
  const content = `
  <h1 class="test">head</h1>
  <code>head2</code>
  `;
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={content + ' ' + classes}
      />
    </div>
  );
};
