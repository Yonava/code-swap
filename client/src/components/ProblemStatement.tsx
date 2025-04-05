import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Button } from './ui/Button';
import classes from './tag.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ProblemStatement = () => {
  const codeInput = `3`;
  const codeOutput = `Weird`;

  const content = `
  <challenge>If-else</challenge>
  <ds> Practice using if-else statements </ds>
  
  <sub-t>Example</sub-t>
  
  <ds>Given an integer, <var>n</var> , perform the following conditional actions:
  <l>
    <i>If <var>n</var> is odd, print <cy>Weird</cy>.</i>
    <i>If <var>n</var> is even and in the inclusive range of <var>2</var> to <var>5</var> , print <cr>Not Weird</cr></i>
  </l>
  <sub-t>Input Format</sub-t>
  <ds>A single line containing a positive integer, <var>n</var></ds>

  <sub-t>Output Format</sub-t>
  <ds>Print <cg>Weird</cg> if the number is weird. Otherwise, print <cb>Not Weird</cb>.</ds>

  <sub-t>Sample Input 0</sub-t>  

  <snip>${codeInput}</snip>

  <sub-t>Sample Output 0</sub-t>  

  <snip>${codeOutput}</snip>
  
  <more><var>n</var> is odd and odd numbers are weird, so print <cy>Weird</cy> </more>
  
  <sub-title>Constrain</sub-title>
  
  <ds>This is the description of this constrain</ds>
  `;

  return (
    <div className={classes.container}>
      <Button className="bg-primary text-on-primary">Click me</Button>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={content}
        components={{
          snip({ node, inline, className, children, ...props }) {
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                customStyle={{ backgroundColor: '#343a3b' }}
                language="javascript"
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
        }}
      />
    </div>
  );
};
