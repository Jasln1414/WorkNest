import React from 'react';

function Messages({ text, send }) {
  return (
    <div className={`
      message-container
      ${send ? 'flex justify-end' : 'flex justify-start'}
      p-2
      w-full
      max-w-lg
    `}>
      <div className={`
        message-bubble
        ${send ? 'bg-blue-500 text-white rounded-lg self-end' : 'bg-gray-200 text-gray-800 rounded-lg self-start'}
        p-3
        max-w-[70%] // Adjust max-width for responsiveness
        break-words
      `}>
        <p className="text-sm">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Messages;