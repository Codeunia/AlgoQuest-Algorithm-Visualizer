import React, { useState, useEffect } from 'react';
import ProblemList from './components/ProblemList';
import AdminPanel from './components/AdminPanel';
import ProblemDetailPage from './components/ProblemDetailPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isRegisterView, setIsRegisterView] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isAdminPanel, setIsAdminPanel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setIsAuthenticated(true);
        setUserRole(user.role);
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(user.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setIsRegisterView(false);
    setSelectedProblemId(null);
    setIsAdminPanel(false);
  };

  const handleSelectProblem = (problemId) => {
    setSelectedProblemId(problemId);
  };

  const handleBackToProblemList = () => {
    setSelectedProblemId(null);
    setIsAdminPanel(false);
  };
  
  const handleAdminPanelToggle = () => {
    setIsAdminPanel(prevState => !prevState);
    setSelectedProblemId(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6">
      {isAuthenticated ? (
        <Dashboard
          userRole={userRole}
          selectedProblemId={selectedProblemId}
          onSelectProblem={handleSelectProblem}
          onBackToList={handleBackToProblemList}
          onAdminPanelToggle={handleAdminPanelToggle}
          isAdminPanel={isAdminPanel}
        />
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isRegisterView ? 'Register for AlgoQuest' : 'Login to AlgoQuest'}
          </h2>

          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setIsRegisterView(true)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300
                ${isRegisterView ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Register
            </button>
            <button
              onClick={() => setIsRegisterView(false)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300
                ${!isRegisterView ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Login
            </button>
          </div>

          {isRegisterView ? <RegisterForm /> : <LoginForm onLoginSuccess={handleLoginSuccess} />}
        </div>
      )}
    </div>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Network error during registration:', err);
      setError('Could not connect to the server. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div>
        <label htmlFor="registerUsername" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
        <input
          type="text"
          id="registerUsername"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="registerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="registerEmail"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="registerPassword"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
      >
        Register
      </button>
    </form>
  );
}

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        console.log('Login successful! Token:', data.token);
        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Network error during login:', err);
      setError('Could not connect to the server. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div>
        <label htmlFor="loginEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="loginEmail"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="loginPassword"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
      >
        Login
      </button>
    </form>
  );
}

export default App;
