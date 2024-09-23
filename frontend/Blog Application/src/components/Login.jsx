import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export default function Register(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate(); 

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const result = await axios.post("http://localhost:3000/login",{username,password},{withCredentials:true});
            if(result.data.message==="Login Successful"){
                navigate("/myBlog")
            }
            else{
                window.location.href = "http://localhost:5173/register";
            }
        }   
        catch(error){
            console.log(error);
        }
    }

    return(
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="username" value={username} placeholder="email"
                    onChange={(e)=>setUsername(e.target.value)} required/>
                    <input type="password" name="password" value={password} placeholder="password"
                    onChange={(e)=>setPassword(e.target.value)} required/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}