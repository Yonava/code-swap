import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Button } from './ui/Button';
import classes from './tag.module.css'


export const ProblemStatement = () => {
  const content = `
  <challenge>Challenge Title</challenge>
  <br>
  <br>
  <ds> This is the description of the challenge. </ds>
  <br>
  <br>
  <sub-title>Example</sub-title>
  <br>
  <br>
  <ds>This is description of an example of the challenge. Examples can include <variable>math notations(n=2)</variable> and <line>code</line>.</ds>
  <br>
  <br>
  <more>This is an explanation to the description </more>
  <br>
  <br>
  <sub-title>Constrain</sub-title>
  <br>
  <br>
  <ds>This is the description of this constrain</ds>
  <br>
  `;
  return (
    <div>
      <Button>Click me</Button>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children = {content + ' '+ classes}
      />
    </div>
  );
};
