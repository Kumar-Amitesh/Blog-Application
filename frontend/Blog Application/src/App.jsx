import { Route,RouterProvider,createBrowserRouter,createRoutesFromElements } from 'react-router-dom'  
import './App.css'
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Blog from './components/Blog';
import Layout from './components/Layout';
import Create from './components/Create'
function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<Layout/>}>
                    <Route path="" element={<Home/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='myBlog' element={<Blog/>}/>
                    <Route path='create' element={<Create/>}/>
                </Route>
            </>
        )
    )

    return(
        <RouterProvider router={router}/>
    )
}

export default App
