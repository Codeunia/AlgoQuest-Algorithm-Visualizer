import React from 'react';
import ProblemList from './ProblemList';
import AdminPanel from './AdminPanel';
import ProblemDetailPage from './ProblemDetailPage';

function Dashboard({
  userRole,
  selectedProblemId,
  onSelectProblem,
  onBackToList,
  onAdminPanelToggle,
  isAdminPanel,
  onLogout
}) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      {/* ================= Header ================= */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">AlgoQuest</h1>
        </div>

        {/* Middle: Nav Links */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-indigo-600">
            Explore
          </a>
          <a href="#" className="hover:text-indigo-600">
            Contests
          </a>
          <a href="#" className="hover:text-indigo-600">
            Discuss
          </a>
          <a href="#" className="hover:text-indigo-600">
            Leaderboard
          </a>
        </nav>

        {/* Right: User + Buttons */}
        <div className="flex items-center space-x-4">
          <p className="hidden md:block text-gray-600">
            Welcome, {user.username}!
          </p>
          {userRole === 'admin' && (
            <button
              onClick={onAdminPanelToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isAdminPanel ? 'View Problems' : 'Admin Panel'}
            </button>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= Content ================= */}
      <div className="grid grid-cols-12 gap-6 p-6 flex-grow">
        {/* ---------- Left Sidebar ---------- */}
        <aside className="col-span-2 hidden lg:block bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Filters</h3>
          <nav className="space-y-2 text-gray-600">
            <a href="#" className="block hover:text-indigo-600">
              All Problems
            </a>
            <a href="#" className="block hover:text-indigo-600">
              My Submissions
            </a>
            <a href="#" className="block hover:text-indigo-600">
              Profile
            </a>
          </nav>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700">Difficulty</h4>
            <div className="mt-2 space-y-1">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Easy
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Medium
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Hard
              </label>
            </div>
          </div>
        </aside>

        {/* ---------- Main Feed ---------- */}
        <main className="col-span-12 lg:col-span-7">
          {selectedProblemId ? (
            <ProblemDetailPage
              problemId={selectedProblemId}
              onBackToList={onBackToList}
            />
          ) : userRole === 'admin' && isAdminPanel ? (
            <AdminPanel />
          ) : (
            <ProblemList onSelectProblem={onSelectProblem} />
          )}
        </main>

        {/* ---------- Right Sidebar ---------- */}
        <aside className="col-span-3 hidden lg:block space-y-4">
          {/* Leaderboard */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-3">🏆 Leaderboard</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-semibold text-indigo-600">User123</span> - 150 pts
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Alice</span> - 120 pts
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Bob</span> - 90 pts
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-semibold mb-3">📌 Recent Activity</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <span className="font-semibold text-indigo-600">You</span> solved{' '}
                <b>Two Sum</b>
              </li>
              <li>
                <span className="font-semibold text-indigo-600">User123</span>{' '}
                submitted <b>Quick Sort</b>
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Alice</span> solved{' '}
                <b>Bubble Sort</b>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ================= Footer ================= */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 text-sm text-gray-600">
          {/* Links */}
          <div className="flex space-x-6 mb-3 md:mb-0">
            <a href="#" className="hover:text-indigo-600">
              About
            </a>
            <a href="#" className="hover:text-indigo-600">
              Help
            </a>
            <a href="#" className="hover:text-indigo-600">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-600">
              Terms
            </a>
          </div>
          {/* Copyright */}
          <p>© {new Date().getFullYear()} AlgoQuest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
