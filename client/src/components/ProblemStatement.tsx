import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import combinedStyles from './tags';
import { Button } from './ui/Button';

export const ProblemStatement = () => {
  const content = `
  <challengeTitle>Challenge Title</challengeTitle>

  <description> This is the description of the challenge. </description>

  <sectionHeader>Example</sectionHeader>

  <example>This is an example of a challenge. Examples can include <variable>math notations</variable> and <line>code</line></example>

  
  <explain>This is an explanation to the example </explain>

  <sectionHeader>Constrain</sectionHeader>
  
  <constrain>This is the constrain of this problem</constrain>



  `;
  return (
    <div>
      <Button>Click me</Button>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={content + ' ' + combinedStyles}
      />
    </div>
  );
};
