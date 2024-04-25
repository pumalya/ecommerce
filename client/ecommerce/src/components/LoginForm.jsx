import { useState } from "react";
import { Navigate } from "react-router-dom";
const API = "http://localhost:3000/api";


export default function LoginForm ({ token }) {
    const [ Email, setEmail ] = useState("");
    const [ Password, setPassword ] = useState("");
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn ] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: Email,
                    password: Password,
                }),
            });
            console.log("response", response);
            const result = await response.json();
            console.log(result, "here");
            const token = result.token;
            setToken(token);
            setLoggedIn(true);
        } catch (error) {
            console.error(error);
            }
        }
    if (loggedIn) {
        return <Navigate to="/" />
    }
    return (
        <>
        <div className="logincontainer">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <h2>Email </h2>
                {error && <p>{error}</p>}
                <label>
                    Email:
                    <input 
                    name="Email"
                    value={Email} 
                    onChange={(e) => setEmail(e.target.value)} />
            </label>
            <h2>Password</h2>
            {error && <p>{error}</p>}
            <label>
                Password:{""}
                <input
                    type="password"
                    value={Password}
                    name="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
            </form>
        </div>
        </>
    );
}
