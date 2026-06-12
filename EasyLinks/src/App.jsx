import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import PublicProfile from './PublicProfile'
import Dashboard from './Dashboard'
import Login from './Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:username" element={<PublicProfile />} />
    </Routes>
  )
}

export default App