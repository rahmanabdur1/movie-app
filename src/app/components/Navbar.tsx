// src/app/components/Navbar.tsx
import React from 'react';


export default function Navbar() {
//   const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className="p-4 flex justify-between items-center bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">Movie App</h1>
      {/* <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button> */}
    </nav>
  );
}
