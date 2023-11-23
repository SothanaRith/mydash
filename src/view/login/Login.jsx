import React, { useContext, useState } from "react";
import "./login.scss"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../component/firebase/firebase_config"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../component/context/useContext";

const Login = () => {
    const [err, setErr] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const {dispatch} = useContext(AuthContext)


    const handleSubmit = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                dispatch({type:"LOGIN",payload:user})
                navigate("/")
                
            })
            .catch((error) => {
               setErr(true)
            });


    }
    return (
        <div>
            <div className="Login">
                <h1>
                    Login
                </h1><br />
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                    <span>{err && "your username or password is wrong!"}</span>
                    <button type="submit">Submit</button>
                </form>
            </div>

        </div>
    )
}
export default Login;