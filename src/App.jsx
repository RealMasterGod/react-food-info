
import { useEffect } from 'react'
import { getCategoryItems } from './features/products/productSlice'
import { useDispatch } from 'react-redux'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import Cart from "./pages/Cart"
import Single from "./pages/Single"


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCategoryItems())
  },[])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout />
      ),
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/:id",
          element: <Single/>
        },
        {
          path: "/cart",
          element: <Cart/>
        },
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
