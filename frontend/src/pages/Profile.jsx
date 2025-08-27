import React from 'react'
import { useAuth } from "../contexts/AuthContext";
import Loading from '../components/hierarchy/Loading';

export default function Profile() {
  const { user } = useAuth();

  const getFallbackAvatar = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  if(!user) return <Loading message="Loading your profile..." />
  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <>
      {user && <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Profile Section */}
        <div className="flex flex-col items-center text-center lg:text-left lg:items-start">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-md object-cover"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-indigo-500 text-white text-4xl font-bold shadow-md">
              {getFallbackAvatar(user.username)}
            </div>
          )}

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.username}
          </h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400">
            Joined: {new Date(user.joinDate).toLocaleDateString()}
          </p>

          {/* <button className="mt-6 w-full lg:w-auto bg-indigo-600 text-white py-2 px-6 rounded-xl font-medium shadow hover:bg-indigo-700 transition">
            Edit Profile
          </button> */}
        </div>

        {/* Right Stats Section */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Dashboard Overview
          </h3>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl px-2 py-6 sm:p-6 shadow-sm text-center">
              <p className="text-2xl font-bold text-indigo-600">{user.xp}</p>
              <p className="text-sm text-gray-500">XP</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-2 py-6 sm:p-6 shadow-sm text-center">
              <p className="text-2xl font-bold text-green-600">{Math.floor(user.xp / 100) + 1}</p>
              <p className="text-sm text-gray-500">Level</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-2 py-6 sm:p-6 shadow-sm text-center">
              <p className="text-2xl font-bold text-pink-600">{user.streak}</p>
              <p className="text-sm text-gray-500">Streak</p>
            </div>
          </div>

          {/* XP Progress Bar Example */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">XP Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-3 rounded-full"
                style={{ width: `${Math.min((user.xp % 100) || 0, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {user.xp % 100}/100 XP to next level
            </p>
          </div>
        </div>
      </div>}
      </>
    // </div>
  );
}