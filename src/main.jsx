import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePages from './Pages/HomePages.jsx'
import ProfilePages from './Pages/ProfilePages.jsx'
import TrashPages from './Pages/TrashPages.jsx'

const router = createBrowserRouter([
  {
    path: '/TheGoals/',
    element: <App />,
    // errorElement: <div>Page Not Found</div>,
    children: [
      {
        path: '/TheGoals/',
        element: <HomePages/>,
      },
      {
        path: '/TheGoals/Trash',
        element: <TrashPages/>
      },
      {
        path: '/TheGoals/Profile',
        element: <ProfilePages/>
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
