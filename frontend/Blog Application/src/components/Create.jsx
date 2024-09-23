import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Create(){
    const navigate = useNavigate();
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await axios.get("http://localhost:3000/create",{withCredentials:true})
                console.log(response.data); // Ensure this prints the response data

                if (response.status === 200) {
                    navigate("/create");
                    // setIsAuth(true);
                } else {
                    navigate("/register");
                }
            } catch (error) {
                console.log("Error checking authentication:", error);
                navigate("/");
            } 
        }

        checkAuth();
    }, [navigate]);

    async function handlePost(e){
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/post", {message:{title:"Hello",desc:"World"}}, { withCredentials: true })
            console.log(response.data); 

            if (response.status === 200) {
                navigate("/myBlog");
            } else {
                console.log("Blog Not Posted")
            }
        } catch (error) {
            console.log("Error posting blog:", error);
            navigate("/");
        } 

    }

    return (
        <>
            <div>
                Post your blog!
                <button type="submit" onClick={handlePost}>Post</button>
            </div>
        </>
    )
}