import React, { useState } from 'react';
import Editor from '@monaco-editor/react'; // Import the Monaco Editor component

function CodeEditor({ starterCode, onCodeChange, language = 'javascript' }) {
  // State to hold the current code in the editor
  const [code, setCode] = useState(starterCode || '');

  // Function called when the editor content changes
  const handleEditorChange = (value, event) => {
    setCode(value); // Update local state
    if (onCodeChange) {
      onCodeChange(value); // Pass the new code up to the parent component
    }
  };

  // Options for the Monaco Editor
  const editorOptions = {
    minimap: { enabled: false }, // Hide the minimap (code overview on the right)
    fontSize: 16, // Set font size
    wordWrap: 'on', // Wrap long lines
    scrollBeyondLastLine: false, // Don't allow scrolling past the end of the file
    automaticLayout: true, // Automatically resize editor when container changes
    readOnly: false, // Allow editing
    // You can add more options here as needed
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <Editor
        height="400px" // Set a fixed height for the editor
        language={language} // Set programming language (e.g., 'javascript', 'python', 'java')
        theme="vs-dark" // Set editor theme ('vs-light', 'vs-dark', 'hc-black')
        value={code} // The initial code content
        options={editorOptions} // Apply custom options
        onChange={handleEditorChange} // Callback for content changes
        // onMount={(editor, monaco) => { /* Optional: access editor instance on mount */ }}
      />
    </div>
  );
}

export default CodeEditor;
// CodeEditor.jsx - A simple code editor component using Monaco Editor
// This component allows users to edit code with syntax highlighting and other features.