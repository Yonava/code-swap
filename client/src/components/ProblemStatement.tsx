import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Button } from './ui/Button';
import classes from './tag.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ProblemStatement = () => {
  const codeSnippet = `console.log('This is a code snippet example.');
    `;

  const content = `
  <challenge>Challenge Title</challenge>
  <ds> This is the description of the challenge. </ds>
  
  <sub-title>Example</sub-title>
  
  <ds>This is description of an example of the challenge. Examples can include <variable>math notations(n=2)</variable> and <ly>code</ly> <lb>code</lb> <lr>code</lr> <lg>code</lg>.</ds>
  
  <snip>${codeSnippet}</snip>
  
  <more>This is an explanation to the description </more>
  
  <sub-title>Constrain</sub-title>
  
  <ds>This is the description of this constrain</ds>
  `;

  return (
    <div className={classes.container}>
      <Button>Click me</Button>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} components={{
        snip({node, inline, className, children, ...props}) {
          return (
            <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
      }} />
    </div>
  );
};