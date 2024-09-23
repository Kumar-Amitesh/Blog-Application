import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Blog() {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blogs,setBlogs] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await axios.get("http://localhost:3000/myBlog",{withCredentials:true})
                console.log(response.data); 

                if (response.status === 200) {
                    setIsAuth(true);
                } else {
                    navigate("/register");
                }
            } catch (error) {
                console.log("Error checking authentication:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [navigate]);

    useEffect(()=>{
        async function checkAuth() {
            try {
                const response = await axios.get("http://localhost:3000/blogs",{withCredentials:true})
                console.log(response.data); 

                if (response.status === 200) {
                    setBlogs(response.data);
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.log( error);
                navigate("/");
            }
        }

        checkAuth();
    },[navigate])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuth) {
        return <div>Redirecting...</div>;
    }

    async function handleLogout(e){
        e.preventDefault();

        try{
            const response = await axios.get("http://localhost:3000/logout",{withCredentials:true})

            if(response.status===200){
                navigate('/');
            }
            else{
                navigate('/myBlog')
            }
        }
        catch(error){
            console.log(error);
            navigate("/myBlog")
        }
    }

    async function HandleCreate(e){
        e.preventDefault();

        try{
            const response = await axios.get("http://localhost:3000/create",{withCredentials:true})

            if(response.status===200){
                navigate('/create');
            }
            else{
                navigate('/myBlog')
            }
        }
        catch(error){
            console.log(error);
            navigate("/")
        }
    }

    async function handleUpdate(blogId) {
        try {
            const response = await axios.patch(`http://localhost:3000/update/${blogId}`, { title: "Amitesh" }, { withCredentials: true });
    
            if (response.status === 200) {
                const updatedBlogIndex = blogs.findIndex(blog => blog._id === blogId);
                if (updatedBlogIndex !== -1) {
                    const updatedBlogs = [...blogs];
                    console.log(updatedBlogs)
                    updatedBlogs[updatedBlogIndex] = response.data;
                    setBlogs(updatedBlogs);
                }
            } else {
                document.write("Error Updating");
            }
        } catch (error) {
            console.log(error);
            navigate("/");
        }
    }
    

    async function handleDelete(blogId){

        try{
            const response = await axios.delete(`http://localhost:3000/deleteOne/${blogId}`,{withCredentials:true})

            if(response.status===200){
                const updatedBlogIndex = blogs.findIndex(blog => blog._id === blogId);
                if (updatedBlogIndex !== -1) {
                    const updatedBlogs = blogs.filter((blog,index)=>{
                        return index!=updatedBlogIndex
                    })
                    setBlogs(updatedBlogs);
                }
            }
            else{
                document.write("Error Deleting");
            }
        }
        catch(error){
            console.log(error);
            navigate("/")
        }
    }

    return (
        <>
            {/* <Link to="/create"> */}
                <button onClick={HandleCreate}>Create Blog</button>
            {/* </Link> */}
            <div>
                Hello! Welcome to my Blog Application.
            </div>
            <button type="submit" onClick={handleLogout}>Logout</button>
            <br/><br/>
            <div>
                {blogs.map((blog)=>{
                    return <div key={blog._id}>
                        {`${blog.Title} ${blog.Desc}`} 
                        <br/>
                        <button onClick={()=>handleDelete(blog._id)}>Delete</button>
                        <button onClick={()=>handleUpdate(blog._id)}>Update</button>
                    </div>
                })}
            </div>
        </>
    );
}
