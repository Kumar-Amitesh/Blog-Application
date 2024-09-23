import { useState } from "react"
import axios from 'axios'
export default function Register(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [response,setresponse] = useState(null);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const result = await axios.post("http://localhost:3000/register",{username,password});
            console.log(result);
            setresponse(result.data.message);
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
                    <button type="submit">Register</button>
                </form>
                {response && <h2>{response}</h2>}
            </div>
        </>
    )
}