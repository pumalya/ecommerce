import { useState } from "react";
import { Navigate } from "react-router-dom";
const API = "http://localhost:3000/api";


export default function LoginForm ({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
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
                username: username,
                password: password,
                }),
            });
            console.log("response", response);
            const result = await response.json();
            console.log(result, "here");
            const token = result.token;
            setToken(token);
            setLoggedIn(true);
        } catch (err) {
            console.error(err);
            }
        }
    if (loggedIn) {
        return <Navigate to="/" />
    }
    return (
        <>
        <div id="loginForm">
            <h2>Log In</h2>
            <form id="login" onSubmit={handleSubmit}>
                {err && <p>{err}</p>}
            <label>
                <h3>Username:{" "}</h3>
                <input 
                    name="username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                <h3>Password:{""}</h3>
                <input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
            </form>
        </div>
    </>
    );
}
