import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import EditProfile from './pages/editProfile';
import PrivateRoute from './components/PrivateRoute';
import CreateTrip from './pages/CreateTrip';
import Match from './pages/Match';
import Chat from './pages/Chat';

const ChatWrapper = () => {
  const { contactId } = useParams();
  return <Chat contactId={contactId} />;
};
function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Travel Companion App</h2>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-trip" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
          <Route path="/match" element={<Match />} />
          <Route path="/chat/:contactId" element={<PrivateRoute><ChatWrapper /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;