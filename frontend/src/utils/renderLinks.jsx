import React from 'react';

export const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const boldRegex = /\*\*(.*?)\*\*/g;
  let parts = text.split(urlRegex);

  parts = parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
      );
    } else {
      // Check for bold text
      const boldParts = part.split(boldRegex);
      return boldParts.map((boldPart, index) => {
        if (index % 2 === 1) { // If it's a match for bold text
          return <strong key={index}>{boldPart}</strong>;
        } else {
          if (index === 0 && part.startsWith('**')) { // If it's the first part and starts with **
            return <React.Fragment key={index}>{boldPart}</React.Fragment>;
          } else {
            // Handle line breaks
            const lines = boldPart.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index !== boldPart.split('\n').length - 1 && <br />}
              </React.Fragment>
            ));
            // Remove the last break if it's empty
            if (lines.length > 0 && lines[lines.length - 1].props.children === '') {
              lines.pop();
            }
            return lines;
          }
        }
      });
    }
  });

  return parts.flat();
};

/* previous logic without bold
export const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
  
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
        );
      } else {
        return part.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
      }
    });
  };
*/