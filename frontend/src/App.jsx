import './App.css'

import { useEffect, useState } from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './components/HomePage'
import Signup from './components/Signup.jsx'
import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client';
import { setOnlineUsers } from './redux/userSlice.js'
import { setSocket } from './redux/socketSlice.js'

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/register', element: <Signup /> },
  { path: '/login', element: <Login /> }
]);
function App() {
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  // const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      const socketio = io(`http://localhost:8000`, {
        query: {
          userId: authUser._id
        }
      });
      console.log("socketio", socketio);
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers) => {
        console.log("onlineUsers", onlineUsers);
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
    <div >
      <RouterProvider router={router} />
    </div>

  );

}




export default App;
