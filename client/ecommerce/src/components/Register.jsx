import { useState } from "react";
import { Navigate } from "react-router-dom";
const API = "http://localhost:3000/api";

export default function Register({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState("false");
    const [loggedIn, setLoggedIn] = useState(false);
    const [err, setErr] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            console.log("submitting");
            const result = await response.json();
            const token = result.token;
            console.log(result);
            setToken(token);
            setLoggedIn(true);
        } catch (err) {
        console.error(err);
        }
    }
    if (loggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <div className="regcontainer">
                <h2>Register for a New Account</h2>
                <form onSubmit={handleSubmit}>
                <h2>Username</h2>
                {err && <p>{err}</p>}
                <label>
                Username:
                <input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                </label>
                <h2>Password</h2>
                <label>
                Password:
                <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    </>
    );
}