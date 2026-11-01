import './App.css'

import { useEffect } from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './components/HomePage'
import Signup from './components/Signup.jsx'
import Login from './components/Login'
import LandingPage from './components/LandingPage'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client';
import { setOnlineUsers } from './redux/userSlice.js'
import { setSocket } from './redux/socketSlice.js'

function RouteErrorBoundary() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0b141a] text-[#e9edef] select-none text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#00a884]/20 flex items-center justify-center text-[#00a884] mb-4 shadow-lg">
        <img src="/iris-logo.jpg" alt="IrisChat Logo" className="w-12 h-12 rounded-xl object-cover" />
      </div>
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-[#8696a0] max-w-md mb-6">
        An unexpected browser rendering error occurred. Please click below to refresh the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-medium text-sm transition-all shadow-md active:scale-95"
      >
        Refresh App
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <LandingPage />, errorElement: <RouteErrorBoundary /> },
  { path: '/chat', element: <Homepage />, errorElement: <RouteErrorBoundary /> },
  { path: '/register', element: <Signup />, errorElement: <RouteErrorBoundary /> },
  { path: '/login', element: <Login />, errorElement: <RouteErrorBoundary /> }
]);

function App() {
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  const sockerUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
  useEffect(() => {
    if (authUser) {
      const socketio = io(sockerUrl, {
        query: {
          userId: authUser._id
        }
      });
      
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => socketio.close();
    }
    else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  return (
    <div className="p-0 m-0">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
