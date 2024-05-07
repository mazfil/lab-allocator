import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";


function Login(props){
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const auth = getAuth();
    const handleLogin = async (e) => {
        e.preventDefault();

        const user = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const uid = userCredential.user;
            login({uid});
        })
        .catch((error) => {
            alert("Invalid username or password \n" + error.code + "\n" + error.message);
        });
    };

    const handlePwReset = async (e) => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Check your email for password reset instructions.")
        })
        .catch((error) => {
        });
    }

    return(
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <img className="login-logo" src={process.env.PUBLIC_URL + '/ANU Crest Inversed Gold.svg'} alt='ANU Logo with Gold Crest' />
                <div className="login-input">
                    <div className="email-field">
                        <label for="user-email">Email:</label>
                        <input type="text" id="user-email" onChange={(e) => setUsername(e.target.value)} required></input>
                    </div>
                    <div className="password-field">
                        <label for="user-password">Password:</label>
                        <input type="password" id="user-password" onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    
                    <div className="login-buttons">
                        <button type="button" onClick={handlePwReset}>Reset Password</button>
                        <button type="submit">Login</button>
                    </div>
                </div>
                
            </form>
            
        </div>
    )
}
export default Login;