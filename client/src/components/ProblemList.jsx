import React, { useState, useEffect } from 'react';

// ProblemList now accepts onSelectProblem as a prop
function ProblemList({ onSelectProblem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = 'http://localhost:5000/api/problems';
        console.log(`Attempting to fetch problems from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        setProblems(data.problems);
      } catch (err) {
        console.error("Error fetching problems:", err);
        if (err.message.includes('Failed to fetch')) {
          setError("Failed to connect to the backend server. Please ensure your Node.js server is running on http://localhost:5000.");
        } else {
          setError(`Failed to load problems: ${err.message}. Please try again later.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 text-lg">Loading problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
        {error}
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center text-gray-600 text-lg py-8">
        No problems found. Check your backend or add some problems via Postman.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Available Problems</h3>
      {problems.map((problem) => (
        <div key={problem._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h4 className="text-xl font-semibold text-indigo-700">{problem.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{problem.description.substring(0, 100)}...</p>
            <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500">
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
          </div>
          {/* NEW: View Problem Button */}
          <button
            onClick={() => onSelectProblem(problem._id)} // Call onSelectProblem with the problem's ID
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 mt-3 sm:mt-0"
          >
            View Problem
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProblemList;
