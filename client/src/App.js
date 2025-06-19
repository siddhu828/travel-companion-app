import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import EditProfile from './pages/editProfile';
import PrivateRoute from './components/PrivateRoute';
import CreateTrip from './pages/CreateTrip';
import Match from './pages/Match';
import Chat from './pages/Chat';
import Explore from './pages/Explore';
import UserTrips from './pages/UserTrips';
import TripDetails from './pages/tripDetails';
import Inbox from './pages/Inbox';
import UserProfile from './pages/UserProfile'
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-trip" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
          <Route path="/match" element={<PrivateRoute><Match /></PrivateRoute>} />
          <Route path="/chat/:contactId" element={<PrivateRoute><ChatWrapper /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/user-trips/:userId" element={<PrivateRoute><UserTrips /></PrivateRoute>} />
          <Route path="/trips/:userId" element={<PrivateRoute><TripDetails /></PrivateRoute>} />
          <Route path="/inbox" element={<PrivateRoute><Inbox /></PrivateRoute>} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<PrivateRoute isAdmin={true}><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;