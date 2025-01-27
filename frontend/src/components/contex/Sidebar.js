import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentRoom, setCurrentRoom }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const rooms = ['general', 'random', 'support'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Chat App</h2>
        <p className="text-sm text-gray-400">Welcome, {user.username}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Rooms
          </h3>
          <ul className="mt-2 space-y-1">
            {rooms.map((room) => (
              <li key={room}>
                <button
                  onClick={() => setCurrentRoom(room)}
                  className={`w-full text-left px-2 py-1 rounded ${
                    currentRoom === room
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  # {room}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;