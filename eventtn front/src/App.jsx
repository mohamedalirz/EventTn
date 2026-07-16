import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Checkout from './pages/Checkout'
import MyTickets from './pages/MyTickets'
import Login from './pages/Login'
import Register from './pages/Register'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CreateEvent from './pages/CreateEvent'
import MyEvents from './pages/MyEvents'
import SponsorshipRequests from './pages/SponsorshipRequests'

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#101B2E',
            color: '#F5F7FA',
            border: '1px solid #1E2C46',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#FF7A3D', secondary: '#101B2E' } },
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/checkout/:id"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/organizer"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/create"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sponsor"
              element={
                <ProtectedRoute allowedRoles={['SPONSOR']}>
                  <SponsorshipRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <div className="mx-auto max-w-xl px-5 py-24 text-center">
                  <h1 className="font-display text-3xl font-bold">Page not found</h1>
                  <p className="mt-2 text-paper-300">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
