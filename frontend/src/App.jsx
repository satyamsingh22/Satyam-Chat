import Home from './components/ui/Home';
import './App.css';
import Signup from './components/ui/Signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/ui/Login';
import MainLayout from './components/ui/MainLayout';
import Profile from './components/ui/Profile';
import EditProfile from './components/ui/EditProfile';
import ChatPage from './components/ui/ChatPage';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUser } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoute from './components/ui/ProtectedRoute';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoute><MainLayout /></ProtectedRoute> ,
    children: [
      {
        path: "/",
        element:<ProtectedRoute><Home /> </ProtectedRoute>,
      },
      {
        path: "/profile/:id",
        element:<ProtectedRoute>  <Profile /></ProtectedRoute>,
      },
      {
        path: "/account/edit",
        element:<ProtectedRoute> <EditProfile /></ProtectedRoute>,
      },
      {
        path: "/chat",
        element:<ProtectedRoute><ChatPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;

    if (user) {
      socketio = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ['websocket'],
      });

      dispatch(setSocket(socketio));

      // Listen to online users
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });
//notification
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return ()=>{
        socketio.close()
        dispatch(setSocket(null))
      } 
    }else if(socket){
      socket?.close()
      dispatch(setSocket(null))

    }

  
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
