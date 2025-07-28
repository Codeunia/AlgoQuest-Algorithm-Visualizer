import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor'; // Import our CodeEditor component

// This component will display a single problem's details and a code editor.
// It expects to receive a `problemId` prop from its parent to know which problem to fetch.
function ProblemDetailPage({ problemId, onBackToList }) {
  const [problem, setProblem] = useState(null); // State to store the fetched problem details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null);   // State for error messages
  const [userCode, setUserCode] = useState(''); // State to store the code typed by the user

  // useEffect Hook: Fetches the problem details when the component mounts or problemId changes.
  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemId) { // If no problemId is provided, set an error
        setError("No problem ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch a single problem from the backend using its ID
        const response = await fetch(`http://localhost:5000/api/problems/${problemId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        setProblem(data.problem);
        setUserCode(data.problem.starterCode || '// Start coding here...'); // Initialize editor with starter code
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError(`Failed to load problem: ${err.message}. Please check your server connection.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [problemId]); // Dependency array: re-run effect if problemId changes

  // Function to handle changes in the CodeEditor
  const handleCodeChange = (newCode) => {
    setUserCode(newCode); // Update the userCode state with the latest code from the editor
  };

  // Conditional rendering for loading, error, and no problem found states
  if (loading) {
    return <div className="text-center py-8">Loading problem details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
        {error}
        <button onClick={onBackToList} className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Back to List</button>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center text-gray-600 text-lg py-8">
        Problem not found.
        <button onClick={onBackToList} className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Back to List</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBackToList} // Button to go back to the problem list
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
      >
        ← Back to Problems
      </button>

      {/* Problem Description Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-3xl font-bold text-indigo-700 mb-3">{problem.title}</h3>
        <div className="flex flex-wrap items-center mb-4 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2
            ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
               problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
               'bg-red-100 text-red-800'}`}>
            {problem.difficulty}
          </span>
          <span className="mr-2">Category: {problem.category}</span>
          {problem.tags && problem.tags.length > 0 && (
            <span className="flex flex-wrap">
              Tags:
              {problem.tags.map((tag, index) => (
                <span key={index} className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
      </div>

      {/* Code Editor Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Your Solution</h4>
        <CodeEditor
          starterCode={problem.starterCode} // Pass problem's starter code to the editor
          onCodeChange={handleCodeChange} // Get updated code from editor
          language="javascript" // Assuming problems are in JavaScript for now
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => alert('Run Code functionality coming soon!')} // Placeholder
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
          >
            Run Code
          </button>
          <button
            onClick={() => alert('Submit Code functionality coming soon!')} // Placeholder
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Submit Solution
          </button>
        </div>
      </div>

      {/* Optional: Display Test Cases (for debugging/understanding) */}
      {problem.testCases && problem.testCases.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Example Test Cases</h4>
          <div className="space-y-2">
            {problem.testCases.map((test, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm font-mono">
                <p><strong>Input:</strong> <span className="text-gray-700">{test.input}</span></p>
                <p><strong>Expected Output:</strong> <span className="text-gray-700">{test.expectedOutput}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDetailPage;
