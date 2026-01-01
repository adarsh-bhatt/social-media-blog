import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayOut, EditPost, Login, Post, SignUp ,Home,AllPost,AddPost} from './component/index.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <AuthLayOut authentication={false}>
            <Login />
          </AuthLayOut>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthLayOut authentication={false}>
            <SignUp />
          </AuthLayOut>
        ),
      },
      {
        path: "all-posts",
        element: (
          <AuthLayOut authentication>
            <AllPost />
          </AuthLayOut>
        ),
      },
      {
        path: "add-post",
        element: (
          <AuthLayOut authentication>
            <AddPost />
          </AuthLayOut>
        ),
      },
      {
        path: "edit-post/:slug",
        element: (
          <AuthLayOut authentication>
            <EditPost />
          </AuthLayOut>
        ),
      },
      {
        path: "post/:slug",
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>

    </Provider>
  </StrictMode>,
)
